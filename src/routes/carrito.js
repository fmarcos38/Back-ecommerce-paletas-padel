const express = require('express');
const { getCarrito, agregarProducto, eliminarProducto } = require('../controllers/carrito');

const router = express.Router();

//trae carrito de un usuario
router.get('/:id', getCarrito);

//agrega producto al carrito
router.post('/agregar/:id', agregarProducto);

//elimina producto del carrito
router.delete('/eliminar/:id', eliminarProducto);

module.exports = router;