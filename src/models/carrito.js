const { Schema, model } = require('mongoose');

const CarritoSchema = new Schema({
    usuario: {
        type: Schema.Types.ObjectId,
        ref: 'Usuario',
        required: true
    },
    productos: [
        {
            producto: {
                type: Schema.Types.ObjectId,
                ref: 'Producto'
            },
            cantidad: {
                type: Number,
                required: true
            }
        }
    ]
});

module.exports = model('Carrito', CarritoSchema);