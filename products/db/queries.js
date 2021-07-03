const pgp = require('pg-promise')({});

const db = pgp({
  user: 'postgres',
  host: '54.213.0.119',
  database:'postgres',
  password: 'password',
  port: 3000
});
// const { Pool } = require('pg');

// const pool = new Pool({
//   user: 'postgres',
//   host: '/tmp',
//   database:'postgres',
//   password: 'railforce515',
//   port: 5432
// });

// pool.on('error', (err, client) => {
//   console.error('Unexpected error on idle client', err)
//   process.exit(-1)
// });

module.exports = db;