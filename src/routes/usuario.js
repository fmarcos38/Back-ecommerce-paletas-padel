const express = require('express');
const { 
    registrarse, traerUsuarios, traerUsuario, modificarUsuario, 
    eliminarUsuario,
    agregarFavoritos,
    eliminarFavoritos,
} = require('../controllers/usuario');
const { confirmarCorreo } = require('../controllers/envioEmail');

const router = express.Router();

//crea usuario
router.post('/registrarse', registrarse);

//envio de email de confirmación
router.post('/confirmar', confirmarCorreo);

//trae usuarios
router.get('/', traerUsuarios);

//trae usuario por id
router.get('/:id', traerUsuario);

//modificar usuario
router.put('/modificar/:id', modificarUsuario);

//eliminar usuario
router.delete('/eliminar/:id', eliminarUsuario);

//------favoritos-------------------------------
//agregar favorito
router.put('/favorito/agregar/:id', agregarFavoritos);
//elimina favorito
router.put('/favorito/eliminar/:id', eliminarFavoritos);


module.exports = router;