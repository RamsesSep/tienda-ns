// db.js
import mysql from 'mysql2'

const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: 'admin123',
  database: 'nsserigrafia'
})

db.connect((err) => {
  if (err) {
    console.error('Error al conectar con la base de datos:', err)
    return
  }
  console.log('Conexión exitosa a MySQL 🐬')
})

export default db
