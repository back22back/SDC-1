const pgp = require('pg-promise')({});

const db = pgp({
  user: 'ubuntu',
  host: 'ec2-35-167-34-39.us-west-2.compute.amazonaws.com',
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