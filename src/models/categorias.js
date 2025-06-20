const { Schema, model } = require('mongoose');

const categoriaSchema = Schema({
    nombre: { type: String, required: true },
});

module.exports = model('Categoria', categoriaSchema);