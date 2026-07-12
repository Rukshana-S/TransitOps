import pool from '../config/db.js';

export const getAssignments = async (req, res, next) => {
  try {
    const result = await pool.query(`
      SELECT v.id as vehicle_id, v.model as vehicle_model, v.reg_number as vehicle_reg,
             d.id as driver_id, d.name as driver_name, d.phone as driver_phone
      FROM vehicles v
      JOIN drivers d ON v.assigned_driver_id = d.id
      ORDER BY v.id DESC
    `);
    return res.status(200).json(result.rows);
  } catch (error) {
    next(error);
  }
};

export const createAssignment = async (req, res, next) => {
  const { vehicleId, driverId } = req.body;

  if (!vehicleId || !driverId) {
    return res.status(400).json({ message: 'Vehicle and Driver IDs are required' });
  }

  try {
    await pool.query('BEGIN');

    // 1. Verify vehicle availability and state
    const vehicleRes = await pool.query('SELECT status, assigned_driver_id FROM vehicles WHERE id = $1', [vehicleId]);
    if (vehicleRes.rows.length === 0) {
      await pool.query('ROLLBACK');
      return res.status(404).json({ message: 'Vehicle not found' });
    }

    const vehicle = vehicleRes.rows[0];
    if (vehicle.status !== 'available' || vehicle.assigned_driver_id !== null) {
      await pool.query('ROLLBACK');
      return res.status(400).json({ message: 'Vehicle is not available or is already assigned' });
    }

    // 2. Verify driver availability and state
    const driverRes = await pool.query('SELECT status, assigned_vehicle_id FROM drivers WHERE id = $1', [driverId]);
    if (driverRes.rows.length === 0) {
      await pool.query('ROLLBACK');
      return res.status(404).json({ message: 'Driver not found' });
    }

    const driver = driverRes.rows[0];
    if (driver.status !== 'Available' || driver.assigned_vehicle_id !== null) {
      await pool.query('ROLLBACK');
      return res.status(400).json({ message: 'Driver is not available or is already assigned' });
    }

    // 3. Make assignments
    await pool.query('UPDATE vehicles SET assigned_driver_id = $1 WHERE id = $2', [driverId, vehicleId]);
    await pool.query('UPDATE drivers SET assigned_vehicle_id = $1 WHERE id = $2', [vehicleId, driverId]);

    await pool.query('COMMIT');

    // Fetch details of created assignment to return
    const detailedRes = await pool.query(`
      SELECT v.id as vehicle_id, v.model as vehicle_model, v.reg_number as vehicle_reg,
             d.id as driver_id, d.name as driver_name, d.phone as driver_phone
      FROM vehicles v
      JOIN drivers d ON v.assigned_driver_id = d.id
      WHERE v.id = $1
    `, [vehicleId]);

    return res.status(201).json(detailedRes.rows[0]);
  } catch (error) {
    await pool.query('ROLLBACK');
    next(error);
  }
};

export const deleteAssignment = async (req, res, next) => {
  const { vehicleId } = req.params;

  try {
    await pool.query('BEGIN');

    const vehicleRes = await pool.query('SELECT assigned_driver_id FROM vehicles WHERE id = $1', [vehicleId]);
    if (vehicleRes.rows.length === 0) {
      await pool.query('ROLLBACK');
      return res.status(404).json({ message: 'Vehicle not found' });
    }

    const driverId = vehicleRes.rows[0].assigned_driver_id;
    if (driverId) {
      await pool.query('UPDATE drivers SET assigned_vehicle_id = NULL WHERE id = $1', [driverId]);
    }
    await pool.query('UPDATE vehicles SET assigned_driver_id = NULL WHERE id = $1', [vehicleId]);

    await pool.query('COMMIT');
    return res.status(200).json({ message: 'Assignment successfully deleted' });
  } catch (error) {
    await pool.query('ROLLBACK');
    next(error);
  }
};
