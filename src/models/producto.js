const { Schema, model } = require('mongoose');

const ProductoSchema = new Schema({
    nombre: {
        type: String,
        required: true
    },
    precio: {
        type: Number,
        required: true
    },
    descripcion: {
        type: String,
        required: true
    },
    imagenes: {
        type: Array,
        required: true
    },
    /* categoria: {
        type: String,
        required: true
    },
    stock: {
        type: Number,
        required: true
    }, */
});

module.exports = model('Producto', ProductoSchema);
