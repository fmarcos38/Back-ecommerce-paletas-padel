
const normalizoProductos = (productos) => {
    return productos.map((producto) => {
        return {
            id: producto.id,
            nombre: producto.nombre,
            precio: producto.precio,
            imagenes: producto.imagenes,
            agotado: producto.agotado,
            enPromo: producto.enPromo,
            porcentajeDescuento: producto.porcentajeDescuento,
            categoria: producto.categoria,
            marca: producto.marca,
            stock: producto.stock,
        };
    });
};

const normalizoProducto = (producto, cantidad) => {
    return {
            id: producto.id,
            nombre: producto.nombre,
            precio: producto.precio,
            imagenes: producto.imagenes,
            agotado: producto.agotado,
            enPromo: producto.enPromo,
            porcentajeDescuento: producto.porcentajeDescuento,
            categoria: producto.categoria,
            marca: producto.marca,
            stock: producto.stock,
            cantidad: cantidad
        };
};

module.exports = {
    normalizoProductos,
    normalizoProducto
};