const express = require('express');
const { registrarse, traerUsuarios, traerUsuario, modificarUsuario, eliminarUsuario } = require('../controllers/usuario');

const router = express.Router();

//crea usuario
router.post('/registrarse', registrarse);

//trae usuarios
router.get('/', traerUsuarios);

//trae usuario por id
router.get('/:id', traerUsuario);

//modificar usuario
router.put('/modificar/:id', modificarUsuario);

//eliminar usuario
router.delete('/eliminar/:id', eliminarUsuario);


module.exports = router;