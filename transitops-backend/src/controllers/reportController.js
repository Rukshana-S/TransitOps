import pool from '../config/db.js';

export const getReports = async (req, res, next) => {
  try {
    const result = await pool.query('SELECT * FROM reports ORDER BY date DESC');
    return res.status(200).json(result.rows);
  } catch (error) {
    next(error);
  }
};

export const createReport = async (req, res, next) => {
  const { id, title, category, type } = req.body;

  if (!title || !category) {
    return res.status(400).json({ message: 'Missing report title or category' });
  }

  const generatedId = id || `REP-${Math.floor(900 + Math.random() * 99)}`;

  try {
    const query = `
      INSERT INTO reports (id, title, category, date, author, size, type) 
      VALUES ($1, $2, $3, $4, $5, $6, $7) 
      RETURNING *`;
    const params = [
      generatedId,
      title,
      category,
      new Date().toISOString().split('T')[0],
      req.user ? req.user.name : 'Alicia Diaz',
      `${(1.1 + Math.random() * 3).toFixed(1)} MB`,
      type || 'PDF'
    ];
    const result = await pool.query(query, params);
    return res.status(201).json(result.rows[0]);
  } catch (error) {
    next(error);
  }
};
