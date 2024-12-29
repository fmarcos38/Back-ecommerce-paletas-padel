const express = require('express');
const cloudinary = require('../config/cloudinary');
const upload = require('../config/multer'); 
const Producto = require('../models/producto');
const { traerProductos } = require('../controllers/producto');

const router = express.Router();

//rutas
//creo producto
router.post('/', upload.array('imagenes', 10), async (req, res) => {
    const { nombre, precio, descripcion } = req.body;
    const imagenes = req.files?.map(file => file.path);

    try {
        const nuevoProducto = new Producto({
            nombre,
            precio,
            descripcion,
            imagenes
        });

        await nuevoProducto.save();

        res.status(201).json({ msg: 'ok' });
    } catch (error) {
        console.error('Error al crear el producto:', error);
        res.status(500).json({ msg: 'Error al crear el producto' });
    }
});

//trae productos
router.get('/', traerProductos);


module.exports = router;