import pool from '../config/db.js';

export const getVehicles = async (req, res, next) => {
  const { search, status } = req.query;
  try {
    let query = `
      SELECT v.*, d.name as driver 
      FROM vehicles v
      LEFT JOIN drivers d ON v.assigned_driver_id = d.id
    `;
    const params = [];
    const conditions = [];

    if (search) {
      params.push(`%${search}%`);
      conditions.push(`(v.id ILIKE $${params.length} OR v.model ILIKE $${params.length} OR v.reg_number ILIKE $${params.length} OR d.name ILIKE $${params.length})`);
    }

    if (status && status !== 'all') {
      params.push(status);
      conditions.push(`v.status = $${params.length}`);
    }

    if (conditions.length > 0) {
      query += ' WHERE ' + conditions.join(' AND ');
    }

    query += ' ORDER BY v.id DESC';

    const result = await pool.query(query, params);
    
    // Format driver name display (e.g. 'Not Assigned' if null)
    const formatted = result.rows.map(row => ({
      ...row,
      driver: row.driver || 'Not Assigned'
    }));

    return res.status(200).json(formatted);
  } catch (error) {
    next(error);
  }
};

export const getVehicleById = async (req, res, next) => {
  const { id } = req.params;
  try {
    const result = await pool.query(`
      SELECT v.*, d.name as driver 
      FROM vehicles v
      LEFT JOIN drivers d ON v.assigned_driver_id = d.id
      WHERE v.id = $1
    `, [id]);

    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'Vehicle not found' });
    }

    const vehicle = result.rows[0];
    vehicle.driver = vehicle.driver || 'Not Assigned';

    return res.status(200).json(vehicle);
  } catch (error) {
    next(error);
  }
};

export const createVehicle = async (req, res, next) => {
  const { 
    id, regNumber, type, manufacturer, model, 
    manufacturingYear, fuelType, mileage, fuel, 
    capacity, status, currentLocation, notes 
  } = req.body;

  if (!id || !regNumber || !model) {
    return res.status(400).json({ message: 'Missing required vehicle fields (Asset Code, Reg Number, Model)' });
  }

  try {
    const existCheck = await pool.query('SELECT * FROM vehicles WHERE id = $1 OR reg_number = $2', [id, regNumber]);
    if (existCheck.rows.length > 0) {
      return res.status(400).json({ message: 'Vehicle ID or registration number already registered' });
    }

    const query = `
      INSERT INTO vehicles (
        id, reg_number, type, manufacturer, model, 
        manufacturing_year, fuel_type, mileage, fuel, 
        capacity, status, current_location, notes, assigned_driver_id
      ) 
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, NULL) 
      RETURNING *`;
    
    const params = [
      id, regNumber, type, manufacturer || null, model, 
      manufacturingYear ? parseInt(manufacturingYear) : null, 
      fuelType || null, mileage || '0 km', fuel || '100%', 
      capacity ? parseInt(capacity) : null, status || 'available', 
      currentLocation || null, notes || null
    ];

    const result = await pool.query(query, params);
    const created = result.rows[0];
    created.driver = 'Not Assigned';

    return res.status(201).json(created);
  } catch (error) {
    next(error);
  }
};

export const updateVehicle = async (req, res, next) => {
  const { id } = req.params;
  const { 
    reg_number, type, manufacturer, model, 
    manufacturing_year, fuel_type, mileage, fuel, 
    capacity, status, current_location, notes 
  } = req.body;

  try {
    const existCheck = await pool.query('SELECT * FROM vehicles WHERE id = $1', [id]);
    if (existCheck.rows.length === 0) {
      return res.status(404).json({ message: 'Vehicle not found' });
    }

    const query = `
      UPDATE vehicles 
      SET reg_number = COALESCE($1, reg_number),
          type = COALESCE($2, type),
          manufacturer = COALESCE($3, manufacturer),
          model = COALESCE($4, model),
          manufacturing_year = COALESCE($5, manufacturing_year),
          fuel_type = COALESCE($6, fuel_type),
          mileage = COALESCE($7, mileage),
          fuel = COALESCE($8, fuel),
          capacity = COALESCE($9, capacity),
          status = COALESCE($10, status),
          current_location = COALESCE($11, current_location),
          notes = COALESCE($12, notes)
      WHERE id = $13 
      RETURNING *`;
    
    const params = [
      reg_number, type, manufacturer, model, 
      manufacturing_year ? parseInt(manufacturing_year) : null, 
      fuel_type, mileage, fuel, 
      capacity ? parseInt(capacity) : null, status, 
      current_location, notes, id
    ];

    const result = await pool.query(query, params);

    // Fetch joined driver details
    const detailed = await pool.query(`
      SELECT v.*, d.name as driver 
      FROM vehicles v
      LEFT JOIN drivers d ON v.assigned_driver_id = d.id
      WHERE v.id = $1
    `, [id]);

    const updated = detailed.rows[0];
    updated.driver = updated.driver || 'Not Assigned';

    return res.status(200).json(updated);
  } catch (error) {
    next(error);
  }
};

export const deleteVehicle = async (req, res, next) => {
  const { id } = req.params;
  try {
    await pool.query('BEGIN');

    const existCheck = await pool.query('SELECT assigned_driver_id FROM vehicles WHERE id = $1', [id]);
    if (existCheck.rows.length === 0) {
      await pool.query('ROLLBACK');
      return res.status(404).json({ message: 'Vehicle not found' });
    }

    const driverId = existCheck.rows[0].assigned_driver_id;
    if (driverId) {
      await pool.query('UPDATE drivers SET assigned_vehicle_id = NULL WHERE id = $1', [driverId]);
    }

    await pool.query('DELETE FROM vehicles WHERE id = $1', [id]);
    await pool.query('COMMIT');

    return res.status(200).json({ message: 'Vehicle decommissioned and deleted' });
  } catch (error) {
    await pool.query('ROLLBACK');
    next(error);
  }
};
