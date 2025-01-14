const { Schema, model } = require('mongoose');

const ProductoSchema = new Schema({
    nombre: {
        type: String,
    },
    precio: {
        type: Number,
    },
    descripcion: {
        type: String,
    },
    imagenes: {
        type: Array,
    },
    categoria: {
        type: String,
        required: true
    },
    stock: {
        type: Number,
    },
    agotado: {
        type: Boolean,
        default: false
    },
    enPromo: {
        type: Boolean,
        default: false
    },
    porcentajeDescuento: {
        type: Number,
        default: 0
    },
    marca: {
        type: String
    },
});

module.exports = model('Producto', ProductoSchema);
