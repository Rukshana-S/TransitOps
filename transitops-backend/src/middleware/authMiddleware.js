import jwt from 'jsonwebtoken';
import pool from '../config/db.js';

export const protect = async (req, res, next) => {
  let token;
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    token = req.headers.authorization.split(' ')[1];
  }

  if (!token) {
    return res.status(401).json({ message: 'Not authorized, token missing' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your_secret_key');
    
    const userRes = await pool.query(
      `SELECT id, email, full_name as name, full_name, role 
       FROM users 
       WHERE id = $1`,
      [decoded.id]
    );

    if (userRes.rows.length === 0) {
      return res.status(401).json({ message: 'User no longer exists' });
    }

    req.user = userRes.rows[0];
    next();
  } catch (error) {
    console.error('❌ JWT Verification Error:', error.message);
    return res.status(401).json({ message: 'Not authorized, invalid token' });
  }
};
