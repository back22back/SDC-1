const { Pool } = require('pg');

const pool = new Pool({
  user: 'postgres',
  host: '/tmp',
  database:'postgres',
  password: 'railforce515',
  port: 5432
});

pool.on('error', (err, client) => {
  console.error('Unexpected error on idle client', err)
  process.exit(-1)
});

// const client = pool.connect();
// client.release();

module.exports = pool;