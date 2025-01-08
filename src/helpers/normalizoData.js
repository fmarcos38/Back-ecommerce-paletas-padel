
const normalizoProdutos = (produtos) => {
    return produtos.map((produto) => {
        return {
            id: produto.id,
            nombre: produto.nombre,
            precio: produto.precio,
            imagenes: produto.imagenes,
            agotado: produto.agotado,
            enPromo: produto.enPromo,
            porcentajeDescuento: produto.porcentajeDescuento,
            categoria: produto.categoria,
            stock: produto.stock,
        };
    });
};

module.exports = {
    normalizoProdutos,
};