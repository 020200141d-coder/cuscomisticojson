// config/db.js
// Reemplaza a admin/config/global.php + admin/config/Conexion.php del proyecto PHP.
// Los datos de conexion ya no estan escritos en el codigo: se leen del archivo .env

require('dotenv').config();
const mysql = require('mysql2/promise');

const pool = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  port: process.env.DB_PORT,
  charset: 'utf8mb4',          // equivale a DB_ENCODE / SET NAMES
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

module.exports = pool;
