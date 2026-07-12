import jwt from 'jsonwebtoken';
import pool from '../config/db.js';

export const protect = async (req, res, next) => {
  let token;
  console.log(`[DEBUG] Route Access: ${req.method} ${req.originalUrl}`);
  console.log(`[DEBUG] Incoming Authorization Header:`, req.headers.authorization);

  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    token = req.headers.authorization.split(' ')[1];
  }

  if (!token) {
    console.log(`[DEBUG] Authorization Failed: Token is missing.`);
    return res.status(401).json({ message: 'Not authorized, token missing' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your_secret_key');
    console.log(`[DEBUG] Decoded JWT:`, decoded);
    
    const userRes = await pool.query(
      `SELECT id, email, full_name as name, full_name, role 
       FROM users 
       WHERE id = $1`,
      [decoded.id]
    );

    if (userRes.rows.length === 0) {
      console.log(`[DEBUG] Authorization Failed: User with id ${decoded.id} no longer exists.`);
      return res.status(401).json({ message: 'User no longer exists' });
    }

    req.user = userRes.rows[0];
    console.log(`[DEBUG] Authenticated User:`, req.user);
    next();
  } catch (error) {
    console.error('[DEBUG] JWT Verification Error:', error.message);
    return res.status(401).json({ message: 'Not authorized, invalid token' });
  }
};
