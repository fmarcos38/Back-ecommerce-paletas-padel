const mongoose = require('mongoose');
const { Schema } = mongoose;

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

// 👇 Este condicional evita el OverwriteModelError
module.exports = mongoose.models.Carrito || mongoose.model('Carrito', CarritoSchema);
