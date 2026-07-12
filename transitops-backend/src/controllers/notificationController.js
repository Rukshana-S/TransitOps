import pool from '../config/db.js';

export const getNotifications = async (req, res, next) => {
  try {
    const result = await pool.query('SELECT * FROM notifications ORDER BY date DESC');
    return res.status(200).json(result.rows);
  } catch (error) {
    next(error);
  }
};

export const createNotification = async (req, res, next) => {
  const { title, message } = req.body;

  if (!title || !message) {
    return res.status(400).json({ message: 'Missing title or message' });
  }

  try {
    const result = await pool.query(
      'INSERT INTO notifications (title, message) VALUES ($1, $2) RETURNING *',
      [title, message]
    );
    return res.status(201).json(result.rows[0]);
  } catch (error) {
    next(error);
  }
};

export const markAsRead = async (req, res, next) => {
  const { id } = req.params;
  try {
    const check = await pool.query('SELECT * FROM notifications WHERE id = $1', [id]);
    if (check.rows.length === 0) {
      return res.status(404).json({ message: 'Notification not found' });
    }

    await pool.query('UPDATE notifications SET read = true WHERE id = $1', [id]);
    return res.status(200).json({ message: 'Notification marked as read' });
  } catch (error) {
    next(error);
  }
};
