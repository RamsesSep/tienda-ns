//console.log('Hello world')
import express from 'express'
import { dirname, join } from 'path'
import { fileURLToPath } from 'url'
import session from 'express-session'
import bodyParser from 'body-parser'
import dotenv from 'dotenv'

// Cargar variables de entorno
dotenv.config()

// importamos las rutas del archivo index.js
// lo podemos llamar como queramos: indexRoutes
import indexRoutes from './routes/index.js'
import authRoutes from './routes/auth.js' // << NUEVA RUTA para login

//crear aplicación con express
const app = express()
const __dirname = dirname(fileURLToPath(import.meta.url))

app.set('views', join(__dirname, 'views'))
app.set('view engine', 'ejs')

// Middlewares
app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json())

// Configuración de sesión
app.use(session({
    secret: 'secreto_super_seguro', // puedes ponerlo en .env
    resave: false,
    saveUninitialized: false,
    cookie: {
        maxAge: 1000 * 60 * 60 * 24 * 365 * 10 // 10 años en milisegundos
    }
}))

// Middleware para pasar usuario a TODAS las vistas
app.use((req, res, next) => {
    res.locals.user = req.session.user
    next()
})

import catalogRoutes from './routes/catalog.js'
app.use(catalogRoutes)

//crear las rutas
app.use(indexRoutes)
app.use(authRoutes) // << NUEVA RUTA

app.use(express.static(join(__dirname, 'public')))

//ejecutarlo con su metodo listen
app.listen(3000)
console.log('Server is listening on port', 3000)