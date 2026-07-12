import pool from '../config/db.js';

export const getFuelLogs = async (req, res, next) => {
  try {
    const result = await pool.query('SELECT * FROM fuel_logs ORDER BY date DESC');
    return res.status(200).json(result.rows);
  } catch (error) {
    next(error);
  }
};

export const createFuelLog = async (req, res, next) => {
  const { id, asset, liters, cost, date, station, status } = req.body;

  if (!asset || !liters || !cost) {
    return res.status(400).json({ message: 'Missing required fuel log fields' });
  }

  const generatedId = id || `FUL-${Math.floor(100 + Math.random() * 900)}`;

  try {
    const query = `
      INSERT INTO fuel_logs (id, asset, liters, cost, date, station, status) 
      VALUES ($1, $2, $3, $4, $5, $6, $7) 
      RETURNING *`;
    const params = [
      generatedId,
      asset,
      parseFloat(liters),
      cost.toString().startsWith('₹') ? cost : `₹${parseInt(cost).toLocaleString()}`,
      date || new Date().toISOString().split('T')[0],
      station || 'HP Refuel Station',
      status || 'Pending'
    ];
    const result = await pool.query(query, params);
    return res.status(201).json(result.rows[0]);
  } catch (error) {
    next(error);
  }
};

export const updateFuelLog = async (req, res, next) => {
  const { id } = req.params;
  const { asset, liters, cost, date, station, status } = req.body;

  try {
    const existCheck = await pool.query('SELECT * FROM fuel_logs WHERE id = $1', [id]);
    if (existCheck.rows.length === 0) {
      return res.status(404).json({ message: 'Fuel log not found' });
    }

    const query = `
      UPDATE fuel_logs 
      SET asset = COALESCE($1, asset),
          liters = COALESCE($2, liters),
          cost = COALESCE($3, cost),
          date = COALESCE($4, date),
          station = COALESCE($5, station),
          status = COALESCE($6, status)
      WHERE id = $7 
      RETURNING *`;
    const params = [asset, liters ? parseFloat(liters) : null, cost, date, station, status, id];
    const result = await pool.query(query, params);
    return res.status(200).json(result.rows[0]);
  } catch (error) {
    next(error);
  }
};

export const deleteFuelLog = async (req, res, next) => {
  const { id } = req.params;
  try {
    const existCheck = await pool.query('SELECT * FROM fuel_logs WHERE id = $1', [id]);
    if (existCheck.rows.length === 0) {
      return res.status(404).json({ message: 'Fuel log not found' });
    }

    await pool.query('DELETE FROM fuel_logs WHERE id = $1', [id]);
    return res.status(200).json({ message: 'Fuel log deleted' });
  } catch (error) {
    next(error);
  }
};
