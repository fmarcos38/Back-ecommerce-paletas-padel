const Usuario = require('../models/usuario');
const CryptoJS = require('crypto-js');
const Producto = require('../models/producto');
const { normalizoProductos } = require('../helpers/normalizoData');
const { normalizaUser, normalizaUsuarios } = require('../helpers/normalizauser');
//const { enviarCorreoConfirmacion } = require('./envioEmail');


//registrarse
const registrarse = async (req, res) => {
    const { nombre, apellido, email, password, direccion, telefono, isAdmin } = req.body;
    
    //busco si ya esxiste el email
    const usuario = await Usuario.findOne({ email });
    if (usuario) {
        return res.status(400).json({ msg: 'El email ya esta registrado' });
    } else {
        //cifro password
        //cifro pass
        const passwordCifrado = CryptoJS.AES.encrypt(
            password,
            process.env.PASS_SEC
        ).toString();

        const nuevoUsuario = await Usuario.create({
            nombre,
            apellido,
            email,
            password: passwordCifrado,
            direccion,
            telefono,
            isAdmin
        });

        // Enviar correo de confirmación
        //await enviarCorreoConfirmacion(email, nombre)
        
        await nuevoUsuario.save();
        return res.status(200).json({ msg: 'success' });
    }
}

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
        const usuario = await Usuario.findById(id);

        if (!usuario) {
            return res.status(404).json({
                msg: 'Usuario no encontrado'
            });
        }
        const userNormalizado = normalizaUser(usuario);
        res.json(userNormalizado);
    }
    catch (error) {
        console.error('Error al traer el usuario:', error);
        res.status(500).json({
            msg: 'Error al traer el usuario'
        });        
    }
}

//modificar usuario
const modificarUsuario = async (req, res) => {
    const { id } = req.params; console.log('id', id);
    const { 
        nombre, apellido, dni, 
        email, direccion, telefono, 
        comentarios, isAdmin 
    } = req.body;
    
    const usuario = await Usuario.findByIdAndUpdate(id, {
        nombre,
        apellido,
        dni,
        email,
        direccion,
        telefono,
        comentarios,
        isAdmin
    });
    usuario.save();

    if (!usuario) {
        return res.status(404).json({
            msg: 'Usuario no encontrado'
        });
    }

    res.json({
        user: usuario,
        msg: 'Usuario modificado' });
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


module.exports = {
    registrarse,
    traerUsuarios,
    traerUsuario,
    modificarUsuario,
    eliminarUsuario,
    agregarFavoritos,
    eliminarFavoritos,
    traerFavoritos
}