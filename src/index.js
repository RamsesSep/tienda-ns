//console.log('Hello world')
import express from 'express'
import { dirname, join } from 'path'
import { fileURLToPath } from 'url'

// importamos las rutas del archivo index.js
// lo podemos llamar como queramos: indexRoutes
import indexRoutes from './routes/index.js'

//crear aplicación con express
const app = express()

const __dirname = dirname(fileURLToPath(import.meta.url))

app.set('views', join(__dirname, 'views'))
app.set('view engine', 'ejs')

//crear las rutas
app.use(indexRoutes)

app.use(express.static(join(__dirname, 'public')))

//ejecutarlo con su metodo listen
app.listen(3000)
console.log('Server is listening on port', 3000)