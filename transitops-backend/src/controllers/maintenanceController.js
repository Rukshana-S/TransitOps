import pool from '../config/db.js';

export const getMaintenance = async (req, res, next) => {
  try {
    const result = await pool.query('SELECT * FROM maintenance ORDER BY date DESC');
    return res.status(200).json(result.rows);
  } catch (error) {
    next(error);
  }
};

export const createMaintenance = async (req, res, next) => {
  const { id, type, asset, date, cost, progress, status } = req.body;

  if (!type || !asset || !date || !cost) {
    return res.status(400).json({ message: 'Missing required maintenance details' });
  }

  const generatedId = id || `MNT-${Math.floor(100 + Math.random() * 900)}`;

  try {
    const query = `
      INSERT INTO maintenance (id, type, asset, date, cost, progress, status) 
      VALUES ($1, $2, $3, $4, $5, $6, $7) 
      RETURNING *`;
    const params = [
      generatedId,
      type,
      asset,
      date,
      cost,
      progress ? parseInt(progress) : 0,
      status || 'Scheduled'
    ];
    const result = await pool.query(query, params);
    return res.status(201).json(result.rows[0]);
  } catch (error) {
    next(error);
  }
};

export const updateMaintenance = async (req, res, next) => {
  const { id } = req.params;
  const { type, asset, date, cost, progress, status } = req.body;

  try {
    const existCheck = await pool.query('SELECT * FROM maintenance WHERE id = $1', [id]);
    if (existCheck.rows.length === 0) {
      return res.status(404).json({ message: 'Maintenance record not found' });
    }

    const query = `
      UPDATE maintenance 
      SET type = COALESCE($1, type),
          asset = COALESCE($2, asset),
          date = COALESCE($3, date),
          cost = COALESCE($4, cost),
          progress = COALESCE($5, progress),
          status = COALESCE($6, status)
      WHERE id = $7 
      RETURNING *`;
    const params = [type, asset, date, cost, progress, status, id];
    const result = await pool.query(query, params);
    return res.status(200).json(result.rows[0]);
  } catch (error) {
    next(error);
  }
};

export const deleteMaintenance = async (req, res, next) => {
  const { id } = req.params;
  try {
    const existCheck = await pool.query('SELECT * FROM maintenance WHERE id = $1', [id]);
    if (existCheck.rows.length === 0) {
      return res.status(404).json({ message: 'Maintenance record not found' });
    }

    await pool.query('DELETE FROM maintenance WHERE id = $1', [id]);
    return res.status(200).json({ message: 'Maintenance record deleted' });
  } catch (error) {
    next(error);
  }
};
