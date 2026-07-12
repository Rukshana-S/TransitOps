import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import pool from './db.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export async function initDatabase() {
  try {
    // Check if users table exists
    const checkQuery = `
      SELECT EXISTS (
        SELECT FROM information_schema.tables 
        WHERE table_schema = 'public' 
        AND table_name = 'users'
      );
    `;
    const checkRes = await pool.query(checkQuery);
    const exists = checkRes.rows[0].exists;

    let schemaMismatch = false;
    if (exists) {
      // Check if vehicles table contains 'assigned_driver_id' column to detect new independent model
      const columnCheckRes = await pool.query(`
        SELECT EXISTS (
          SELECT FROM information_schema.columns 
          WHERE table_name = 'vehicles' 
          AND column_name = 'assigned_driver_id'
        );
      `);
      schemaMismatch = !columnCheckRes.rows[0].exists;
    }

    if (!exists || schemaMismatch) {
      if (schemaMismatch) {
        console.log('⚠️ Schema mismatch detected. Dropping old tables to migrate to new independent vehicles/drivers structure...');
        await pool.query('DROP TABLE IF EXISTS users, roles, vehicles, drivers, trips, maintenance, fuel_logs, expenses, reports, notifications CASCADE;');
      }

      console.log('🔄 Initializing PostgreSQL Database Schema...');
      
      // Paths to files - database folder is in the parent workspace root
      const schemaPath = path.resolve(__dirname, '../../../database/schema.sql');
      const seedPath = path.resolve(__dirname, '../../../database/seed.sql');

      if (fs.existsSync(schemaPath)) {
        const schemaSql = fs.readFileSync(schemaPath, 'utf8');
        const queries = schemaSql
          .split(';')
          .map(q => q.trim())
          .filter(q => q.length > 0);
        
        for (const query of queries) {
          await pool.query(query);
        }
        console.log('✅ Database Schema created successfully.');
      } else {
        console.warn('⚠️ schema.sql not found at:', schemaPath);
      }

      if (fs.existsSync(seedPath)) {
        const seedSql = fs.readFileSync(seedPath, 'utf8');
        const seedQueries = seedSql
          .split(';')
          .map(q => q.trim())
          .filter(q => q.length > 0);
        
        for (const query of seedQueries) {
          await pool.query(query);
        }
        console.log('✅ Database seeded successfully.');
      } else {
        console.warn('⚠️ seed.sql not found at:', seedPath);
      }
    } else {
      console.log('✅ Database already initialized and schema is valid.');
      await pool.query('ALTER TABLE reports ADD COLUMN IF NOT EXISTS file_url VARCHAR(255) DEFAULT NULL;');
    }
  } catch (error) {
    console.error('❌ Database Initialization Failed:', error.message);
  }
}
