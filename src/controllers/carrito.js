const { normalizoProduto } = require('../helpers/normalizoData');
const Carrito = require('../models/carrito');

//trae carrito de un usuario
const getCarrito = async (req, res) => {
    const { id } = req.params;
    try {
        const carrito = await Carrito.findOne({ usuario: id }).populate('productos.producto');
        if (!carrito) return res.json({ message: 'El carrito esta vacio' });
        //normalizo la data de los productos
        const prodNormalizado = carrito.productos.map((producto) => normalizoProduto(producto.producto));
        res.json({ carrito: prodNormalizado });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

//agrega producto al carrito
const agregarProducto = async (req, res) => {
    const { id } = req.params;
    const { productoId, cantidad } = req.body;
    try {
        const { productoId, cantidad } = req.body;
        const carrito = await Carrito.findOne({ usuario: id });
        //si no existe carrito para el usuario lo creo
        if (!carrito) {
            const nuevoCarrito = new Carrito({ usuario: id, productos: [{ producto: productoId, cantidad }] });
            await nuevoCarrito.save();
            return res.json({ message: 'Producto agregado al carrito' });
        } else {            
                //si ya existe el producto en el carrito, sumo la cantidad
                const productoExistente = carrito.productos.find((producto) => producto.producto.toString() === productoId);
                if (productoExistente) {
                    productoExistente.cantidad += cantidad;
                } else {
                    //si no existe el producto en el carrito lo agrego
                    carrito.productos.push({ producto: productoId, cantidad });
                }
                await carrito.save();
                return res.json({ message: 'Producto agregado al carrito' });
        }        
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

//elimina producto del carrito
const eliminarProducto = async (req, res) => {
    try {
        const { productoId } = req.body;
        const carrito = await Carrito.findOne({ usuario: req.usuario._id });
        //filtro el producto a eliminar
        carrito.productos = carrito.productos.filter((producto) => producto.producto.toString() !== productoId);
        await carrito.save();
        res.json({ message: 'Producto eliminado del carrito' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

module.exports = {
    getCarrito,
    agregarProducto,
    eliminarProducto
}