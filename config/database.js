require('dotenv').config();

const { Pool } = require('pg');
/*
const pool = new Pool({
    user: 'postgres',
    host: 'localhost',
    database: 'pgsrhdw',
    password: 'root',
    port: 5432,
});
*/

const pool = new Pool({
    user: process.env.DB_USER,
    host: process.env.DB_HOST,
    database: process.env.DB_DATABASE,
    password: process.env.DB_PASSWORD,
    port: process.env.DB_PORT,
});
module.exports = pool;
