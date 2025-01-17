const express = require('express');
const { getCarrito, agregarProducto, eliminarProducto } = require('../controllers/carrito');

const router = express.Router();

//trae carrito de un usuario
router.get('/:id', getCarrito);

//agrega producto al carrito
router.put('/agregar/:id', agregarProducto);

//elimina producto del carrito
router.delete('/eliminar/:clienteId', eliminarProducto);

module.exports = router;