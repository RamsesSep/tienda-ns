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
router.get('/carrito', async (req, res) => {
    const usuario_id = req.session.user.id;

    try {
        const [rows] = await db.execute('SELECT * FROM carrito WHERE usuario_id = ?', [usuario_id]);
        res.render('carrito', { carrito: rows });
    } catch (err) {
        console.error('Error al obtener el carrito:', err);
        res.status(500).send('Error al cargar el carrito');
    }
});

// Si los productos son estáticos y están definidos en otro archivo, mejor quita esta ruta de aquí
// y deja la del archivo catalog.js
// router.get('/catalogo', (req, res) => { ... })

router.get('/register', (req, res) => res.render('register'))

export default router
