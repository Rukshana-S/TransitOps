import pool from '../config/db.js';

export const getTrips = async (req, res, next) => {
  try {
    const result = await pool.query('SELECT * FROM trips ORDER BY id DESC');
    return res.status(200).json(result.rows);
  } catch (error) {
    next(error);
  }
};

export const createTrip = async (req, res, next) => {
  const { id, vehicle, driver, cargo, pickup, destination, distance, eta, status } = req.body;

  if (!vehicle || !driver || !pickup || !destination) {
    return res.status(400).json({ message: 'Missing required trip dispatcher fields' });
  }

  const generatedId = id || `TR-${Math.floor(1000 + Math.random() * 9000)}`;

  try {
    await pool.query('BEGIN');

    // Insert trip
    const query = `
      INSERT INTO trips (id, vehicle, driver, cargo, pickup, destination, distance, eta, status) 
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9) 
      RETURNING *`;
    const params = [
      generatedId, 
      vehicle, 
      driver, 
      cargo || 'General Freight', 
      pickup, 
      destination, 
      distance || '15 km', 
      eta || '15:00', 
      status || 'Pending'
    ];
    
    const result = await pool.query(query, params);

    // Update vehicle and driver status based on initial status
    const vId = vehicle.split(' ')[0];
    if (status === 'In Progress' || status === 'Assigned') {
      await pool.query("UPDATE vehicles SET status = 'on trip' WHERE id = $1", [vId]);
      await pool.query("UPDATE drivers SET status = 'On Shift' WHERE name = $1", [driver]);
    }

    await pool.query('COMMIT');
    return res.status(201).json(result.rows[0]);
  } catch (error) {
    await pool.query('ROLLBACK');
    next(error);
  }
};

export const updateTrip = async (req, res, next) => {
  const { id } = req.params;
  const { vehicle, driver, cargo, pickup, destination, distance, eta, status } = req.body;

  try {
    await pool.query('BEGIN');

    const existCheck = await pool.query('SELECT * FROM trips WHERE id = $1', [id]);
    if (existCheck.rows.length === 0) {
      await pool.query('ROLLBACK');
      return res.status(404).json({ message: 'Trip record not found' });
    }

    const query = `
      UPDATE trips 
      SET vehicle = COALESCE($1, vehicle),
          driver = COALESCE($2, driver),
          cargo = COALESCE($3, cargo),
          pickup = COALESCE($4, pickup),
          destination = COALESCE($5, destination),
          distance = COALESCE($6, distance),
          eta = COALESCE($7, eta),
          status = COALESCE($8, status)
      WHERE id = $9 
      RETURNING *`;
    const params = [vehicle, driver, cargo, pickup, destination, distance, eta, status, id];
    const result = await pool.query(query, params);
    const updatedTrip = result.rows[0];

    // Adjust physical states on completed or cancelled
    if (updatedTrip.status === 'Completed' || updatedTrip.status === 'Cancelled') {
      const vId = updatedTrip.vehicle.split(' ')[0];
      await pool.query("UPDATE vehicles SET status = 'available' WHERE id = $1", [vId]);
      await pool.query("UPDATE drivers SET status = 'Available' WHERE name = $1", [updatedTrip.driver]);
    } else if (updatedTrip.status === 'In Progress' || updatedTrip.status === 'Assigned') {
      const vId = updatedTrip.vehicle.split(' ')[0];
      await pool.query("UPDATE vehicles SET status = 'on trip' WHERE id = $1", [vId]);
      await pool.query("UPDATE drivers SET status = 'On Shift' WHERE name = $1", [updatedTrip.driver]);
    }

    await pool.query('COMMIT');
    return res.status(200).json(updatedTrip);
  } catch (error) {
    await pool.query('ROLLBACK');
    next(error);
  }
};

export const deleteTrip = async (req, res, next) => {
  const { id } = req.params;
  try {
    await pool.query('BEGIN');

    const existCheck = await pool.query('SELECT * FROM trips WHERE id = $1', [id]);
    if (existCheck.rows.length === 0) {
      await pool.query('ROLLBACK');
      return res.status(404).json({ message: 'Trip record not found' });
    }

    const trip = existCheck.rows[0];
    // Revert status of vehicle and driver when trip log is deleted
    const vId = trip.vehicle.split(' ')[0];
    await pool.query("UPDATE vehicles SET status = 'available' WHERE id = $1", [vId]);
    await pool.query("UPDATE drivers SET status = 'Available' WHERE name = $1", [trip.driver]);

    await pool.query('DELETE FROM trips WHERE id = $1', [id]);
    await pool.query('COMMIT');

    return res.status(200).json({ message: 'Trip dispatcher log deleted' });
  } catch (error) {
    await pool.query('ROLLBACK');
    next(error);
  }
};
