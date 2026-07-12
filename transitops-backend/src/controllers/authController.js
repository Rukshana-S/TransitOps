import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import pool from '../config/db.js';

export const register = async (req, res, next) => {
  const { full_name, email, phone, employee_id, department, role, password } = req.body;

  // Validate required inputs
  if (!full_name || !email || !phone || !employee_id || !department || !role || !password) {
    return res.status(400).json({ message: 'All registration fields are required' });
  }

  // Frontend validation replication (Backend safeguard)
  if (full_name.length < 3) {
    return res.status(400).json({ message: 'Full Name must be at least 3 characters' });
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return res.status(400).json({ message: 'Invalid email address format' });
  }

  const phoneDigits = phone.replace(/\D/g, '');
  if (phoneDigits.length < 10) {
    return res.status(400).json({ message: 'Phone Number must contain at least 10 digits' });
  }

  if (password.length < 8) {
    return res.status(400).json({ message: 'Password must be at least 8 characters long' });
  }

  // Check if email already exists
  try {
    const existCheck = await pool.query('SELECT id FROM users WHERE email = $1', [email.toLowerCase().trim()]);
    if (existCheck.rows.length > 0) {
      return res.status(400).json({ message: 'Email address already registered' });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Insert user into PostgreSQL
    const query = `
      INSERT INTO users (full_name, email, phone, employee_id, department, role, password)
      VALUES ($1, $2, $3, $4, $5, $6, $7)
      RETURNING id, full_name, email, role, created_at`;
    
    const params = [
      full_name.trim(),
      email.toLowerCase().trim(),
      phone.trim(),
      employee_id.trim(),
      department.trim(),
      role.trim(),
      hashedPassword
    ];

    const result = await pool.query(query, params);

    return res.status(201).json({
      message: 'User registered successfully. You can now login.',
      user: result.rows[0]
    });
  } catch (error) {
    next(error);
  }
};

export const login = async (req, res, next) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: 'Please provide email and password' });
  }

  try {
    const userRes = await pool.query(
      `SELECT id, email, password, full_name, role 
       FROM users 
       WHERE email = $1`,
      [email.toLowerCase().trim()]
    );

    if (userRes.rows.length === 0) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    const user = userRes.rows[0];
    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    const token = jwt.sign(
      { id: user.id, role: user.role },
      process.env.JWT_SECRET || 'your_secret_key',
      { expiresIn: '30d' }
    );

    return res.status(200).json({
      token,
      user: {
        id: user.id,
        email: user.email,
        name: user.full_name,
        full_name: user.full_name,
        role: user.role
      }
    });
  } catch (error) {
    next(error);
  }
};

export const logout = async (req, res) => {
  return res.status(200).json({ message: 'Successfully logged out' });
};

export const getProfile = async (req, res) => {
  return res.status(200).json({ user: req.user });
};
