import { Router } from 'express'
const router = Router()

router.get('/', (req, res) => {
    if (!req.session.user) {
        return res.redirect('/login')
    }

    res.render('index') // Ya no pasas user
})

router.get('/about', (req, res) => res.render('about'))

//router.get('/carrito', (req, res) => res.render('carrito'))
router.get('/carrito', (req, res) => {
    // Si no hay carrito en la sesión, lo inicializamos vacío
    const carrito = req.session.carrito || []

    res.render('carrito', { productos })
})

// Si los productos son estáticos y están definidos en otro archivo, mejor quita esta ruta de aquí
// y deja la del archivo catalog.js
// router.get('/catalogo', (req, res) => { ... })

router.get('/register', (req, res) => res.render('register'))

export default router
