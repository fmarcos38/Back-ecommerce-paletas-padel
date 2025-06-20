const mongoose = require('mongoose');
const Usuario = require('../models/usuario');
const CryptoJS = require('crypto-js');
const Producto = require('../models/producto');
const { normalizoProductos } = require('../helpers/normalizoData');
const { normalizaUser, normalizaUsuarios } = require('../helpers/normalizauser');


//trae usuarios 
const traerUsuarios = async (req, res) => {
    try {
        const usuarios = await Usuario.find();
        const usuariosNormalizados = normalizaUsuarios(usuarios);
        res.json(usuariosNormalizados);
    } catch (error) {
        console.error('Error al traer los usuarios:', error);
        res.status(500).json({
            msg: 'Error al traer los usuarios'
        });        
    }
}

//traer usuario por id
const traerUsuario = async (req, res) => {
    try {
        const { id } = req.params; 

        // Verificar si el ID es válido
        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({ error: 'El ID proporcionado no es válido.' });
        }

        const usuario = await Usuario.findById(id);
        const userNormalizado = normalizaUser(usuario);

        if (!usuario) {
            return res.status(404).json({ error: 'Usuario no encontrado.' });
        }

        res.status(200).json(userNormalizado);
    } catch (error) {
        console.error('Error al traer el usuario:', error);
        res.status(500).json({ error: 'Error interno del servidor.' });
    }
};

//trae usuario por DNI
const traerUsuarioPorDni = async (req, res) => {
    const { dni } = req.params; 
    
    try {
        const usuario = await Usuario.findOne({dni});
        if(!usuario){
            return res.status(404).json({msg: 'El DNI no está registrado'});
        }
        const userNormalizado = normalizaUser(usuario);
        res.json(userNormalizado); 
    }catch (error) {
        console.error('Error al traer el usuario:', error);
        res.status(500).json({
            msg: 'Error al traer el usuario'
        });        
    }
}

//modificar usuario
const modificarUsuario = async (req, res) => {
    const { id } = req.params; 
    const { 
        nombre, apellido, dni, 
        email, direccion, telefono, 
        comentarios, isAdmin 
    } = req.body; 
    
    try {
        //realizo la modif
        const usuario = await Usuario.findByIdAndUpdate(id, {
            nombre,
            apellido,
            dni,
            email,
            direccion,
            telefono,
            comentarios,
        });
        usuario.save();

        if (!usuario) {
            return res.status(404).json({
                msg: 'Usuario no encontrado'
            });
        }

        res.json({ msg: 'success' });
    } catch (error) {
        console.error('Error al modificar el usuario:', error);
        res.status(500).json({
            msg: 'Error al modificar el usuario'
        });
    }
}

//eliminar usuario
const eliminarUsuario = async (req, res) => {
    const { id } = req.params;

    const usuario = await Usuario.findByIdAndDelete(id);

    if (!usuario) {
        return res.status(404).json({
            msg: 'Usuario no encontrado'
        });
    }

    res.json({ msg: 'Usuario eliminado' });
}

//--agregar favoritos
const agregarFavoritos = async (req, res) => {
    const { id } = req.params; 
    const { idProd } = req.body; 
    
    const usuario = await Usuario.findById(id);
    if(!usuario){
        return res.status(404).json({msg: 'Usuario no encontrado'});
    }
    if(!idProd || idProd === '' || idProd === null || idProd === undefined){
        return res.status(400).json({msg: 'Id de producto no válido'});
    }

    const favoritos = usuario.favoritos;
    favoritos.push(idProd);

    await Usuario.findByIdAndUpdate(id, {favoritos});

    res.json({msg: 'Producto agregado a favoritos'});
};

//elimina de favoritos
const eliminarFavoritos = async (req, res) => { 
    const { id } = req.params; 
    const { idProd } = req.body;

    const usuario = await Usuario.findById(id);
    if(!usuario){
        return res.status(404).json({msg: 'Usuario no encontrado'});
    }

    const favoritos = usuario.favoritos;
    const index = favoritos.indexOf(idProd);
    if(index === -1){
        return res.status(404).json({msg: 'Producto no encontrado en favoritos'});
    }
    if(index > -1){
        favoritos.splice(index, 1);
    }

    await Usuario.findByIdAndUpdate(id, {favoritos});

    res.json({msg: 'Producto eliminado de favoritos'});
};

//trae favoritos
const traerFavoritos = async (req, res) => {
    const { id } = req.params;

    const usuario = await Usuario.findById({_id: id});
    if(!usuario){
        return res.status(404).json({msg: 'Usuario no encontrado'});
    }

    let favoritos = [];
    //recorro los favoritos del usuario
    for (let i = 0; i < usuario.favoritos.length; i++) {
        const producto = await Producto.findById(usuario.favoritos[i]);
        favoritos.push(producto);
    }

    //normalizo los datos
    favoritos = normalizoProductos(favoritos);
    res.json(favoritos);
}

//modificar contraseña
const modificarPassword = async (req, res) => {
    const { id } = req.params;
    let { password } = req.body;

    // Verificar si password es válido
    if (!password || typeof password !== "string") {
        return res.status(400).json({ msg: "Contraseña inválida" });
    }

    // Verificar si la clave secreta está definida
    if (!process.env.PASS_SEC) {
        console.error("Error: SECRET_KEY no está definida en el archivo de entorno.");
        return res.status(500).json({ msg: "Error del servidor: Clave secreta no definida" });
    }

    try {
        // Encriptar la contraseña
        const passwordEncriptada = CryptoJS.AES.encrypt(password, process.env.PASS_SEC).toString();

        // Actualizar el usuario
        const usuario = await Usuario.findByIdAndUpdate(
            id,
            { password: passwordEncriptada },
            { new: true } // Devuelve el usuario actualizado
        );

        if (!usuario) {
            return res.status(404).json({ msg: 'Usuario no encontrado' });
        }

        res.json({ msg: 'success' });
    } catch (error) {
        console.error('Error al modificar el usuario:', error);
        res.status(500).json({ msg: 'Contraseña incorrecta' });
    }
};


module.exports = {
    traerUsuarios,
    traerUsuario,
    traerUsuarioPorDni,
    modificarUsuario,
    eliminarUsuario,
    agregarFavoritos,
    eliminarFavoritos,
    traerFavoritos,
    modificarPassword
}