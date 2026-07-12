import pool from '../config/db.js';

export const getExpenses = async (req, res, next) => {
  try {
    const result = await pool.query('SELECT * FROM expenses ORDER BY date DESC');
    return res.status(200).json(result.rows);
  } catch (error) {
    next(error);
  }
};

export const createExpense = async (req, res, next) => {
  const { id, category, vehicle, description, amount, date, status } = req.body;

  if (!category || !vehicle || !amount || !description) {
    return res.status(400).json({ message: 'Missing required expense fields' });
  }

  const generatedId = id || `EXP-${Math.floor(1000 + Math.random() * 9000)}`;

  try {
    const query = `
      INSERT INTO expenses (id, category, vehicle, description, amount, date, status) 
      VALUES ($1, $2, $3, $4, $5, $6, $7) 
      RETURNING *`;
    const params = [
      generatedId,
      category,
      vehicle,
      description,
      parseFloat(amount),
      date || new Date().toISOString().split('T')[0],
      status || 'Pending'
    ];
    const result = await pool.query(query, params);
    return res.status(201).json(result.rows[0]);
  } catch (error) {
    next(error);
  }
};

export const updateExpense = async (req, res, next) => {
  const { id } = req.params;
  const { category, vehicle, description, amount, date, status } = req.body;

  try {
    const existCheck = await pool.query('SELECT * FROM expenses WHERE id = $1', [id]);
    if (existCheck.rows.length === 0) {
      return res.status(404).json({ message: 'Expense record not found' });
    }

    const query = `
      UPDATE expenses 
      SET category = COALESCE($1, category),
          vehicle = COALESCE($2, vehicle),
          description = COALESCE($3, description),
          amount = COALESCE($4, amount),
          date = COALESCE($5, date),
          status = COALESCE($6, status)
      WHERE id = $7 
      RETURNING *`;
    const params = [category, vehicle, description, amount ? parseFloat(amount) : null, date, status, id];
    const result = await pool.query(query, params);
    return res.status(200).json(result.rows[0]);
  } catch (error) {
    next(error);
  }
};

export const deleteExpense = async (req, res, next) => {
  const { id } = req.params;
  try {
    const existCheck = await pool.query('SELECT * FROM expenses WHERE id = $1', [id]);
    if (existCheck.rows.length === 0) {
      return res.status(404).json({ message: 'Expense record not found' });
    }

    await pool.query('DELETE FROM expenses WHERE id = $1', [id]);
    return res.status(200).json({ message: 'Expense record deleted' });
  } catch (error) {
    next(error);
  }
};
