import { Router } from 'express'
const router = Router()

// podemos enviar objetos o variables ejemplo llamada: title
router.get('/', (req, res) => res.render('index', { title: 'Ramses', x: 30 }))

router.get('/about', (req, res) => res.render('about'))

router.get('/contact', (req, res) => res.render('contact'))

// Exportarlo para que devuelva las rutas
export default router