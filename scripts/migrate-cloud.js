const { Pool } = require('pg');
const fs = require('fs');
const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '../.env') });

const initSql = path.join(__dirname, 'init.sql');

async function migrate() {
  const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: { rejectUnauthorized: false } // Required for Render
  });

  try {
    console.log('Connecting to cloud database...');
    const client = await pool.connect();
    
    console.log('Reading init.sql...');
    const sql = fs.readFileSync(initSql, 'utf8');
    
    console.log('Executing migration...');
    await client.query(sql);
    
    console.log('Migration complete ✓');
    client.release();
  } catch (err) {
    console.error('Migration failed:', err);
  } finally {
    await pool.end();
  }
}

migrate();
