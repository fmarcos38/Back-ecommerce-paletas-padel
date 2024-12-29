const Productos = require('../models/producto');

//trae productos
const traerProductos = async (req, res) => {
    try {
        const productos = await Productos.find();
        res.status(200).json(productos);
    } catch (error) {
        console.error('Error al traer los productos:', error);
        res.status(500).json({ msg: 'Error al traer los productos' });
    }
};


module.exports = {
    traerProductos
};