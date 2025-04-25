import { Router } from 'express'
const router = Router()

// 🟢 Paso 1: Productos definidos en código (estáticos)
const productos = [
    {
        id: 1,
        nombre: 'Playera Personalizada',
        descripcion: 'Playera de algodón 100% personalizada con tu diseño.',
        precio: 150,
        imagen: '/img/playera1.jpg'
    },
    {
        id: 2,
        nombre: 'Taza Estampada',
        descripcion: 'Taza blanca de cerámica con diseño personalizado.',
        precio: 80,
        imagen: '/img/taza1.jpg'
    },
    {
        id: 3,
        nombre: 'Sudadera Bordada',
        descripcion: 'Sudadera con tu logo bordado en alta calidad.',
        precio: 300,
        imagen: '/img/sudadera1.jpg'
    }
]

// 🟢 Paso 2: Ruta para mostrar catálogo
router.get('/catalogo', (req, res) => {
    res.render('catalogo', { productos })
})

// Ruta para agregar productos al carrito
router.post('/add-to-cart', (req, res) => {
    const { id, cantidad } = req.body
    const producto = productos.find(p => p.id == id)

    if (!producto) return res.status(404).send('Producto no encontrado')

    if (!req.session.cart) {
        req.session.cart = []
    }

    const productoExistente = req.session.cart.find(item => item.id == id)
    if (productoExistente) {
        productoExistente.cantidad += parseInt(cantidad)
    } else {
        req.session.cart.push({ ...producto, cantidad: parseInt(cantidad) })
    }

    res.redirect('/catalogo')
})

// 🟢 Ruta para mostrar carrito
router.get('/carrito', (req, res) => {
    const carrito = req.session.cart || []
    res.render('carrito', { carrito })
})

export default router
