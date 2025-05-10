// db.js
import mysql from 'mysql2/promise';

const db = await mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: 'admin123',
  database: 'nsserigrafia'
});

console.log('Conexión exitosa a MySQL 🐬');

export default db;
