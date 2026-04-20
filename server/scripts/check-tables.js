const { Client } = require('pg');
require('dotenv').config();

async function check() {
  const client = new Client({ connectionString: process.env.OLD_DATABASE_URL });
  await client.connect();
  const res = await client.query(`SELECT table_name FROM information_schema.tables WHERE table_schema = 'public'`);
  console.log('Tables in SOURCE DB:', res.rows.map(r => r.table_name));
  await client.end();

  const client2 = new Client({ connectionString: process.env.DATABASE_URL });
  await client2.connect();
  const res2 = await client2.query(`SELECT table_name FROM information_schema.tables WHERE table_schema = 'public'`);
  console.log('Tables in TARGET DB:', res2.rows.map(r => r.table_name));
  await client2.end();
}

check();
