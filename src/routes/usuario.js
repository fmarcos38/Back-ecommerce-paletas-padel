const express = require('express');
const { 
    traerUsuarios, traerUsuario, traerUsuarioPorDni, modificarUsuario, 
    eliminarUsuario, agregarFavoritos, eliminarFavoritos, traerFavoritos, modificarPassword
} = require('../controllers/usuario');

const router = express.Router();


//trae usuarios
router.get('/', traerUsuarios);

//trae usuario por id
router.get('/:id', traerUsuario);

//trae usuario por dni
router.get('/dni/:dni', traerUsuarioPorDni);

//modificar usuario
router.put('/modifica/:id', modificarUsuario);

//modif pass
router.put('/modificaPass/:id', modificarPassword);

//eliminar usuario
router.delete('/eliminar/:id', eliminarUsuario);

//------favoritos-------------------------------
//traer favoritos
router.get('/favoritos/:id', traerFavoritos);
//agregar favorito
router.put('/favorito/agregar/:id', agregarFavoritos);
//elimina favorito
router.put('/favorito/eliminar/:id', eliminarFavoritos);



module.exports = router;