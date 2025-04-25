import { Router } from 'express'
import db from '../db.js'

const router = Router()

// Ruta para mostrar el formulario de login
router.get('/login', (req, res) => {
  res.render('login', { error: null })
})

// Ruta para procesar el login
router.post('/login', (req, res) => {
  const { email, password } = req.body

  if (!email || !password) {
    return res.render('login', { error: 'Por favor llena todos los campos.' })
  }

  db.query('SELECT * FROM users WHERE email = ? AND password = ?', [email, password], (err, results) => {
    if (err) {
      console.error(err)
      return res.render('login', { error: 'Error del servidor.' })
    }

    if (results.length > 0) {
      req.session.user = results[0] // Guarda al usuario en la sesión
      res.redirect('/') // Aquí asegúrate que esta ruta exista y tenga algo para mostrar
    } else {
      res.render('login', { error: 'Correo o contraseña incorrectos.' })
    }
  })
})


// Para registrarse
router.post('/register', (req, res) => {
  const { name, email, password } = req.body

  // Validación básica
  if (!name || !email || !password) {
    return res.render('register', { error: 'Completa todos los campos.' })
  }

  // Insertar en la base de datos
  db.query('INSERT INTO users (name, email, password) VALUES (?, ?, ?)', [name, email, password], (err, result) => {
    if (err) {
      console.error(err)
      return res.render('register', { error: 'Error al registrar el usuario.' })
    }

    res.redirect('/login')
  })
})

// Ruta para cerrar sesión
router.get('/logout', (req, res) => {
  req.session.destroy(err => {
    if (err) {
      return res.send('Error al cerrar sesión.')
    }
    res.redirect('/login')
  })
})

export default router
