const { Schema, model } = require('mongoose');

const UsuarioSchema = Schema({
    nombre: {
        type: String,
        required: true
    },
    apellido: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    telefono: {
        type: Number,
        required: true
    },
    favoritos: {
        type: Array,
        default: []
    },
    direccion: {
        type: String,
        required: true
    },
    isAdmin: {
        type: Boolean,
        required: true
    },
    correoVerificado: {
        type: Boolean,
        default: false
    }
});

module.exports = model('Usuario', UsuarioSchema);