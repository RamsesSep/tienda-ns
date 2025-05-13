import { Router } from 'express'
import db from '../db.js'

const router = Router()

// Ruta para mostrar el formulario de login
router.get('/login', (req, res) => {
  res.render('login', { error: null })
})

router.get('/admin', async (req, res) => {

  try {
    // Verificar que este logueado y sea administrador
    if (!req.session.user || req.session.user.id != 7 || req.session.user.name !== 'administrador') {
      return res.status(403).send('Acceso denegado');
    }

    // consulta a la base de datos
    const [users] = await db.execute('SELECT * FROM users');

    // renderiza el dashboard con los usuarios
    res.render('admin', { users });
  } catch (error) {
    console.error(error);
    res.status(500).send('Error al cargar la vista de administrador')
  }

  //res.render('admin', { error: null })
})

// Ruta para procesar el login
router.post('/login', async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.render('login', { error: 'Por favor llena todos los campos.' });
  }

  try {
    const [results] = await db.execute(
      'SELECT * FROM users WHERE email = ? AND password = ?',
      [email, password]
    );

    if (results.length > 0) {
      req.session.user = results[0];
      console.log("usuario:", req.session.user.id, req.session.user.name);
      if (req.session.user.id == 7 && req.session.user.name == 'administrador') {
        res.redirect('/admin')
      } else {
        res.redirect('/');
      }
    } else {
      res.render('login', { error: 'Correo o contraseña incorrectos.' });
    }
  } catch (err) {
    console.error(err);
    res.render('login', { error: 'Error del servidor.' });
  }
});

// Para registrarse
router.post('/register', async (req, res) => {
  const { name, email, password } = req.body;

  if (!name || !email || !password) {
    return res.render('register', { error: 'Completa todos los campos.' });
  }

  try {
    // Verificar si el correo ya está registrado
    const [usuarios] = await db.execute(
      'SELECT * FROM users WHERE email = ?',
      [email]
    );

    if (usuarios.length > 0) {
      return res.render('register', {
        error: 'El correo ya está registrado. Intenta con otro.'
      });
    }

    // Insertar nuevo usuario
    await db.execute(
      'INSERT INTO users (name, email, password) VALUES (?, ?, ?)',
      [name, email, password]
    );

    res.redirect('/login');
  } catch (err) {
    console.error(err);
    res.render('register', { error: 'Error al registrar el usuario.' });
  }
});

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
