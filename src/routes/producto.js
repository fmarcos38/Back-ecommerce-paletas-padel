const express = require('express');
const cloudinary = require('../config/cloudinary');
const upload = require('../config/multer'); 
const Producto = require('../models/producto');
const { traerProductos, traerProducto, traerProductosRangoPrecio, buscarProductoPorNombre } = require('../controllers/producto');

const router = express.Router()

//rutas
//creo producto
router.post('/', upload.fields([{ name: 'imagenes' }]), async (req, res) => {
    const { data } = req.body;

    try {
        // Parsear el JSON que llega del body
        const parsedData = JSON.parse(data);
        const { nombre, precio, descripcion, imagenes, agotado, enPromo, porcentajeDescuento, categoria, stock, marca } = parsedData;

        // Validación de precio
        const precioNumerico = parseFloat(precio);
        if (isNaN(precioNumerico)) {
            return res.status(400).json({ msg: 'El precio debe ser un número válido' });
        }

        // Subir imágenes a Cloudinary
        const imagenesUrls = await Promise.all(
            (req.files['imagenes'] || []).map((file) => {
                return new Promise((resolve, reject) => {
                    const uploadStream = cloudinary.uploader.upload_stream(
                        (error, result) => {
                            if (error) return reject(error);
                            resolve(result.secure_url);
                        }
                    );
                    uploadStream.end(file.buffer); // Enviar buffer a Cloudinary
                });
            })
        );
        
        //verifico que el producto no exista por nombre
        const existeProd = await Producto.findOne({ nombre });
        if (existeProd) {
            return res.status(400).json({ msg: 'Ya existe un producto con ese nombre' });
        }

        // Crear el nuevo producto
        const nuevoProducto = new Producto({
            nombre,
            precio: precioNumerico,
            descripcion,
            imagenes: imagenesUrls, // Guardar las URLs subidas
            agotado,
            enPromo,
            porcentajeDescuento,
            categoria,
            stock,
            marca
        });

        await nuevoProducto.save();

        res.status(201).json({ msg: 'Producto creado exitosamente' });
    } catch (error) {
        console.error('Error al crear el producto:', error);
        res.status(500).json({ msg: 'Error al crear el producto' });
    }
});

//trae productos
router.get('/', traerProductos);

//trae productos en rango de precios +- enviado desde el front
router.get('/rangoPrecio', traerProductosRangoPrecio);

//busca prod por nombre
router.get('/busca', buscarProductoPorNombre);

//trae un producto por id - siempre el q es con :id va al final
router.get('/:id', traerProducto);

//elimina producto y sus imagenes de cloudinary
router.delete('/:id', async (req, res) => {
    const { id } = req.params;

    try {
        const producto = await Producto.findById(id);
        if (!producto) {
            return res.status(404).json({ msg: 'Producto no encontrado' });
        }

        // Eliminar imágenes de Cloudinary
        if (producto.imagenes && Array.isArray(producto.imagenes)) {
            await Promise.all(
                producto.imagenes.map(async (imagen) => {
                    if (typeof imagen === 'string') {
                        const publicId = imagen.split('/').pop().split('.')[0];
                        await cloudinary.uploader.destroy(publicId);
                    }
                })
            );
        }

        await Producto.findByIdAndDelete(id);
        res.status(200).json({ msg: 'ok' });
    } catch (error) {
        console.error('Error al eliminar el producto:', error);
        res.status(500).json({ msg: 'Error al eliminar el producto' });
    }
});

//edita producto
router.put('/edita/:id', upload.fields([{ name: 'imagenes' }]), async (req, res) => {
    const { id } = req.params;
    
    try {
        // Parsear el JSON que llega del body
        const { data } = req.body;
        const parsedData = JSON.parse(data);
        const { nombre, precio, imgsExistentes, descripcion, agotado, enPromo, porcentajeDescuento, stock, categoria, marca } = parsedData;

        // Buscar el producto
        const producto = await Producto.findById(id);
        if (!producto) {
            return res.status(404).json({ msg: 'Producto no encontrado' });
        }

        // Subir nuevas imágenes a Cloudinary
        const imagenesUrls = await Promise.all(
            (req.files['imagenes'] || []).map((file) => {
                return new Promise((resolve, reject) => {
                    const uploadStream = cloudinary.uploader.upload_stream(
                        (error, result) => {
                            if (error) return reject(error);
                            resolve(result.secure_url);
                        }
                    );
                    uploadStream.end(file.buffer); // Enviar buffer a Cloudinary
                });
            })
        );
        // Combinar todas las URLs
        const todasLasImagenes = [...imgsExistentes, imagenesUrls];

        // Actualizar el producto
        await Producto.findByIdAndUpdate(id, {
            nombre: nombre || producto.nombre,
            precio: precio || producto.precio,
            descripcion: descripcion || producto.descripcion,
            imagenes: todasLasImagenes || producto.imagenes,
            agotado: agotado || producto.agotado,
            enPromo: enPromo || producto.enPromo,
            porcentajeDescuento: porcentajeDescuento || producto.porcentajeDescuento,
            stock: stock || producto.stock,
            categoria: categoria || producto.categoria,
            marca: marca || producto.marca,
        });

        res.status(200).json({ msg: 'Producto actualizado correctamente' });
    } catch (error) {
        console.error('Error al editar el producto:', error);
        res.status(500).json({ msg: 'Error al editar el producto' });
    }
});


module.exports = router;