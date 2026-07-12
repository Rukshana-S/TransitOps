import pool from '../config/db.js';

export const getDrivers = async (req, res, next) => {
  const { search, status } = req.query;
  try {
    let query = `
      SELECT d.*, v.model as vehicle 
      FROM drivers d
      LEFT JOIN vehicles v ON d.assigned_vehicle_id = v.id
    `;
    const params = [];
    const conditions = [];

    if (search) {
      params.push(`%${search}%`);
      conditions.push(`(d.name ILIKE $${params.length} OR d.license ILIKE $${params.length} OR v.model ILIKE $${params.length} OR d.id ILIKE $${params.length})`);
    }

    if (status && status !== 'all') {
      params.push(status);
      conditions.push(`d.status ILIKE $${params.length}`);
    }

    if (conditions.length > 0) {
      query += ' WHERE ' + conditions.join(' AND ');
    }

    query += ' ORDER BY d.id DESC';

    const result = await pool.query(query, params);
    
    // Format vehicle name display (e.g. 'Not Assigned' if null)
    const formatted = result.rows.map(row => ({
      ...row,
      vehicle: row.vehicle ? `${row.assigned_vehicle_id} (${row.vehicle})` : 'Not Assigned'
    }));

    return res.status(200).json(formatted);
  } catch (error) {
    next(error);
  }
};

export const createDriver = async (req, res, next) => {
  const { id, name, employeeId, license, licenseExpiry, phone, email, joiningDate, status, safetyScore } = req.body;

  if (!name || !license || !phone) {
    return res.status(400).json({ message: 'Missing required driver fields (Name, License, Phone)' });
  }

  const generatedId = id || `DR-${Math.floor(100 + Math.random() * 900)}`;

  try {
    const existCheck = await pool.query('SELECT * FROM drivers WHERE id = $1 OR license = $2', [generatedId, license]);
    if (existCheck.rows.length > 0) {
      return res.status(400).json({ message: 'Driver ID or license already registered' });
    }

    const query = `
      INSERT INTO drivers (
        id, name, employee_id, license, license_expiry, 
        phone, email, joining_date, status, safety_score, assigned_vehicle_id
      ) 
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, NULL) 
      RETURNING *`;
    
    const params = [
      generatedId,
      name,
      employeeId || null,
      license,
      licenseExpiry || null,
      phone,
      email || null,
      joiningDate || new Date().toISOString().split('T')[0],
      status || 'Available',
      safetyScore ? parseInt(safetyScore) : 90
    ];

    const result = await pool.query(query, params);
    const created = result.rows[0];
    created.vehicle = 'Not Assigned';

    return res.status(201).json(created);
  } catch (error) {
    next(error);
  }
};

export const updateDriver = async (req, res, next) => {
  const { id } = req.params;
  const { name, employee_id, license, license_expiry, phone, email, joining_date, status, safety_score } = req.body;

  try {
    const existCheck = await pool.query('SELECT * FROM drivers WHERE id = $1', [id]);
    if (existCheck.rows.length === 0) {
      return res.status(404).json({ message: 'Driver profile not found' });
    }

    const query = `
      UPDATE drivers 
      SET name = COALESCE($1, name),
          employee_id = COALESCE($2, employee_id),
          license = COALESCE($3, license),
          license_expiry = COALESCE($4, license_expiry),
          phone = COALESCE($5, phone),
          email = COALESCE($6, email),
          joining_date = COALESCE($7, joining_date),
          status = COALESCE($8, status),
          safety_score = COALESCE($9, safety_score)
      WHERE id = $10 
      RETURNING *`;
    
    const params = [
      name, employee_id, license, license_expiry, 
      phone, email, joining_date, status, 
      safety_score ? parseInt(safety_score) : null, id
    ];

    await pool.query(query, params);

    // Fetch details with joined vehicle
    const detailed = await pool.query(`
      SELECT d.*, v.model as vehicle 
      FROM drivers d
      LEFT JOIN vehicles v ON d.assigned_vehicle_id = v.id
      WHERE d.id = $1
    `, [id]);

    const updated = detailed.rows[0];
    updated.vehicle = updated.vehicle ? `${updated.assigned_vehicle_id} (${updated.vehicle})` : 'Not Assigned';

    return res.status(200).json(updated);
  } catch (error) {
    next(error);
  }
};

export const deleteDriver = async (req, res, next) => {
  const { id } = req.params;
  try {
    await pool.query('BEGIN');

    const existCheck = await pool.query('SELECT assigned_vehicle_id FROM drivers WHERE id = $1', [id]);
    if (existCheck.rows.length === 0) {
      await pool.query('ROLLBACK');
      return res.status(404).json({ message: 'Driver profile not found' });
    }

    const vehicleId = existCheck.rows[0].assigned_vehicle_id;
    if (vehicleId) {
      await pool.query('UPDATE vehicles SET assigned_driver_id = NULL WHERE id = $1', [vehicleId]);
    }

    await pool.query('DELETE FROM drivers WHERE id = $1', [id]);
    await pool.query('COMMIT');

    return res.status(200).json({ message: 'Driver profile deleted' });
  } catch (error) {
    await pool.query('ROLLBACK');
    next(error);
  }
};
