const { Pool } = require('pg');

let pool = null;

function getPool() {
  if (pool) return pool;
  if (!process.env.DATABASE_URL) return null;
  pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: { rejectUnauthorized: false },
    max: 1,
  });
  return pool;
}

async function query(text, params) {
  const p = getPool();
  if (!p) return { mock: true, rows: null, rowCount: 0 };
  return p.query(text, params);
}

module.exports = { getPool, query };