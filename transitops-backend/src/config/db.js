import pg from 'pg';
import dotenv from 'dotenv';

dotenv.config();

const { Pool } = pg;

// Use DATABASE_URL if available, otherwise construct from components
const connectionString = process.env.DATABASE_URL;

const poolConfig = connectionString 
  ? { connectionString }
  : {
      user: process.env.DB_USER || 'postgres',
      password: process.env.DB_PASSWORD || 'password',
      host: process.env.DB_HOST || 'localhost',
      port: parseInt(process.env.DB_PORT || '5432'),
      database: process.env.DB_DATABASE || 'transitops',
    };

const pool = new Pool(poolConfig);

// Test database connection on load
pool.query('SELECT NOW()', (err, res) => {
  if (err) {
    console.error('❌ PostgreSQL Pool Connection Error:', err.message);
  } else {
    console.log('⚡ PostgreSQL Pool Connected Successfully at:', res.rows[0].now);
  }
});

export default pool;
