const express = require('express');
const cloudinary = require('../config/cloudinary');
const upload = require('../config/multer'); 
const Producto = require('../models/producto');
const { traerProductos, traerProducto, traerProductosRangoPrecio } = require('../controllers/producto');

const router = express.Router()

//rutas
//creo producto
router.post('/', upload.fields([{ name: 'imagenes' }]), async (req, res) => {
    const { data } = req.body;

    try {
        // Parsear el JSON que llega del body
        const parsedData = JSON.parse(data);
        const { nombre, precio, descripcion, imagenes, agotado, enPromo, porcentajeDescuento } = parsedData;

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

        // Crear el nuevo producto
        const nuevoProducto = new Producto({
            nombre,
            precio: precioNumerico,
            descripcion,
            imagenes: imagenesUrls, // Guardar las URLs subidas
            agotado,
            enPromo,
            porcentajeDescuento,
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

//trae un producto por id - siempre el q es con :id va al final
router.get('/:id', traerProducto);

//edita producto
router.put('/:id', upload.fields([{ name: 'imagenes' }]), async (req, res) => {
    const { id } = req.params;
    
    try {
        // Parsear el JSON que llega del body
        const parsedData = JSON.parse(data);
        const { nombre, precio, descripcion, imagenes, agotado, enPromo, porcentajeDescuento } = parsedData;

        //busco el producto
        const producto = await Producto.findById(id);
        if (!producto) {
            return res.status(404).json({ msg: 'Producto no encontrado' });
        }
        
        // Subir imágenes a Cloudinary, pero si ya existen que no se repitan
        const imagenesUrls = await Promise.all(
            (req.files['imagenes'] || []).map(async (file) => {
                const existingImage = producto.imagenes.find(img => img.originalname === file.originalname);
                if (existingImage) {
                    return existingImage.url;
                } else {
                    const result = await cloudinary.uploader.upload(file.path);
                    return result.secure_url;
                }
            })
        );

        await Producto.findByIdAndUpdate(id, {
            nombre,
            precio,
            descripcion,
            imagenes: imagenesUrls,
            agotado,
            enPromo,
            porcentajeDescuento
        });

        res.status(200).json({ msg: 'ok' });
    } catch (error) {
        console.error('Error al editar el producto:', error);
        res.status(500).json({ msg: 'Error al editar el producto' });
    }
});

//elimina producto y sus imagenes de cloudinary
router.delete('/:id', async (req, res) => {
    const { id } = req.params;

    try {
        const producto = await Producto.findById(id);
        if (!producto) {
            return res.status(404).json({ msg: 'Producto no encontrado' });
        }

        // Eliminar las imágenes de Cloudinary
        await Promise.all(
            producto.imagenes.map((imagen) => {
                const public_id = imagen.split('/').slice(-1)[0].split('.')[0];
                return cloudinary.uploader.destroy(public_id);
            })
        );

        await Producto.findByIdAndDelete(id);
        res.status(200).json({ msg: 'ok' });
    } catch (error) {
        console.error('Error al eliminar el producto:', error);
        res.status(500).json({ msg: 'Error al eliminar el producto' });
    }
});



module.exports = router;