import { Router } from 'express'
const router = Router()
import db from '../db.js'

// Productos definidos como estáticos
const productos = [
    {
        id: 1,
        nombre: 'Playera - color negro',
        descripcion: 'Playera 100% algodón personalizada con tu diseño.',
        precio: 150,
        imagen: '/img/playera1.jpg',
        tipo: 'ropa'
    },
    {
        id: 2,
        nombre: 'Taza común - color rojo',
        descripcion: 'Taza roja de cerámica con diseño personalizado.',
        precio: 80,
        imagen: '/img/taza1.jpg'
    },
    {
        id: 3,
        nombre: 'Sudadera Bordada',
        descripcion: 'Sudadera con tu logo bordado en alta calidad.',
        precio: 300,
        imagen: '/img/sudadera1.jpg',
        tipo: 'ropa'
    },
    {
        id: 4,
        nombre: 'Playera verde',
        descripcion: 'Playera del chico que asiste a todos los eventos wwe',
        precio: 200,
        imagen: '/img/camisa.jpg',
        tipo: 'ropa'
    }
]

// Ruta para mostrar catálogo
router.get('/catalogo', (req, res) => {
    res.render('catalogo', { productos })
})

// Ruta para agregar productos al carrito
router.post('/add-to-cart', async (req, res) => {
    try {
        const { id, cantidad, talla } = req.body;

        if (!req.session.user) return res.redirect('/login');
        const usuarioId = req.session.user.id;
        const nombre = req.session.user.name;

        console.log("este es el id: " + usuarioId + " y nombre: " + nombre)

        if (!usuarioId) {
            return res.status(401).send('Debes iniciar sesión');
        }

        // Buscar el producto por ID
        const producto = productos.find(p => p.id == id);
        if (!producto) return res.status(404).send('Producto no encontrado');

        if (talla == null) {
            console.log(' -------------------------------- La talla es nula');
            console.log(' -------------------------------- Se subira sin talla')

            // Insertar nuevo registro
            await db.execute(
                `INSERT INTO carrito (usuario_id, producto_id, nombre, descripcion, precio, imagen, cantidad) VALUES (?, ?, ?, ?, ?, ?, ?)`,
                [
                    usuarioId,
                    producto.id,
                    producto.nombre,
                    producto.descripcion,
                    producto.precio,
                    producto.imagen,
                    parseInt(cantidad),
                ]
            );

            res.redirect('/catalogo');

        } else {
            // Verificar si el producto con misma talla ya está en el carrito
            const [rows] = await db.execute(
                `SELECT * FROM carrito WHERE usuario_id = ? AND producto_id = ? AND talla = ?`,
                [usuarioId, id, talla]
            );

            if (rows.length > 0) {
                // Ya existe: actualizar cantidad
                const nuevoValor = parseInt(rows[0].cantidad) + parseInt(cantidad);
                await db.execute(
                    `UPDATE carrito SET cantidad = ? WHERE id = ?`,
                    [nuevoValor, rows[0].id]
                );
            } else {
                // No existe: insertar nuevo registro
                await db.execute(
                    `INSERT INTO carrito (usuario_id, producto_id, talla, nombre, descripcion, precio, imagen, cantidad) VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
                    [
                        usuarioId,
                        producto.id,
                        talla,
                        producto.nombre,
                        producto.descripcion,
                        producto.precio,
                        producto.imagen,
                        parseInt(cantidad),
                    ]
                );
            }

            res.redirect('/catalogo');
        }

    } catch (error) {
        console.error(error);
        res.status(500).send('Error al agregar al carrito');
        res.redirect('/catalogo')
    }
})

router.post('/eliminar-producto', async (req,res) => {
    // eliminaremos el producto del carrito de compras
    //console.log('estoy tratando de eliminar')
    try {

        const { id } = req.body;
        //console.log('Producto a eliminar tiene le ID:' + id)

        // Borrar el registro
        await db.execute('DELETE FROM carrito WHERE id = ?', [id]);

        res.redirect('/carrito');

    } catch (error) {
        console.error(error);
        res.status(500).send('Error al intentar eliminar producto');
    }
})

// Ruta para mostrar carrito
router.get('/carrito', async (req, res) => {
    if (!req.session.user) {
        return res.redirect('/login');
    }

    const usuarioId = req.session.user.id;

    try {
        const [carrito] = await db.execute(
            'SELECT * FROM carrito WHERE usuario_id = ?',
            [usuarioId]
        );

        res.render('carrito', { carrito });
    } catch (error) {
        console.error(error);
        res.status(500).send('Error al cargar el carrito');
    }
});


/*
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
*/

export default router
