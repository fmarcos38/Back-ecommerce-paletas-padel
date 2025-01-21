const { normalizoProductos } = require('../helpers/normalizoData');
const Productos = require('../models/producto');

//trae productos
const traerProductos = async (req, res) => {
    const {limit, offset, categoria, marca, enPromo, precioMin, precioMax} = req.query;
    
    try {
        let productos;
        let filtros = {};

        //construyo los filtros
        if (categoria) filtros.categoria = categoria;
        if (marca) filtros.marca = marca;
        if (enPromo) filtros.enPromo = enPromo;
        if (precioMin && precioMax) {
            filtros.precio = { $gte: precioMin, $lte: precioMax };
        } else if (precioMin) {
            filtros.precio = { $gte: precioMin };
        } else if (precioMax) {
            filtros.precio = { $lte: precioMax };
        }

        //realizo la consulta con los filtros
        if (limit && offset) {
            productos = await Productos.find(filtros).skip(Number(offset)).limit(Number(limit));
        } else {
            productos = await Productos.find(filtros);
        }

        //obtengo el total de productos
        const totalProductos = await Productos.countDocuments(filtros);

        //normalizo la respuesta
        const prodsNormalizados = normalizoProductos(productos);
        //envio la respuesta
        res.status(200).json({
            total: totalProductos,
            prodsNormalizados,
        });
    } catch (error) {
        console.error('Error al traer los productos:', error);
        res.status(500).json({ msg: 'Error al traer los productos' });
    }
};

//trae un producto por id
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

//trae productos en rango de precios +- enviado desde el front
const traerProductosRangoPrecio = async (req, res) => {
    const { limit, offset, precioMin, precioMax } = req.query; 
    
    try {
        let productos;
        let filtros = {};

        //construyo los filtros
        if (Number(precioMin) && Number(precioMax)) {
            filtros.precio = { $gte: precioMin, $lte: precioMax };
        }
        //realizo la consulta con los filtros
        if (limit && offset) {
            productos = await Productos.find(filtros).skip(Number(offset)).limit(Number(limit));
        } else {
            productos = await Productos.find(filtros);
        }
        //normalizo
        const prodsNormalizados = normalizoProdutos(productos);
        //envio la respuesta
        res.status(200).json(prodsNormalizados);
    } catch (error) {
        
    }
}

//busca un producto por nombre
const buscarProductoPorNombre = async (req, res) => {
    const { nombre } = req.query; console.log("req.query:", req.query);

    try {
        const producto = await Productos.find({ nombre: { $regex: nombre, $options: 'i' } });
        if (!producto) {
            return res.status(404).json({ msg: 'Producto no encontrado' });
        }
        res.status(200).json({msg: 'true'});
    } catch (error) {
        console.error('Error al buscar el producto:', error);
        res.status(500).json({ msg: 'Error al buscar el producto' });
    }
}

module.exports = {
    traerProductos,
    traerProducto,
    traerProductosRangoPrecio,
    buscarProductoPorNombre,
};