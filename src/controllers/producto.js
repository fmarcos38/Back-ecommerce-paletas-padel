const { normalizoProdutos } = require('../helpers/normalizoData');
const Productos = require('../models/producto');

//trae productos
const traerProductos = async (req, res) => {
    try {
        const productos = await Productos.find();
        //normalizo la respuesta
        const prodsNormalizados = normalizoProdutos(productos);
        res.status(200).json(prodsNormalizados);
    } catch (error) {
        console.error('Error al traer los productos:', error);
        res.status(500).json({ msg: 'Error al traer los productos' });
    }
};

//trae un producto
const traerProducto = async (req, res) => {
    const { id } = req.params; 

    try {
        const producto = await Productos.findById(id);
        if (!producto) {
            return res.status(404).json({ msg: 'Producto no encontrado' });
        }
        
        res.status(200).json(producto);
    }catch (error) {
        console.error('Error al traer el producto:', error);
        res.status(500).json({ msg: 'Error al traer el producto' });
    }
}


module.exports = {
    traerProductos,
    traerProducto,
};