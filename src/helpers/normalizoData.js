
const normalizoProdutos = (produtos) => {
    return produtos.map((produto) => {
        return {
            id: produto.id,
            nombre: produto.nombre,
            precio: produto.precio,
            imagenes: produto.imagenes,
        };
    });
};

module.exports = {
    normalizoProdutos,
};