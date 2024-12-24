const Usuario = require('../models/usuario');
const CryptoJS = require('crypto-js');
const mongoose = require('mongoose');
const nodemailer = require('nodemailer');


// Configuración del transporte de nodemailer
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: 'fmarcos.23@gmail.com',
        pass: '140183dieteticamilo'
    }
});

// Enviar correo de confirmación
const enviarCorreoConfirmacion = async (email, nombre) => {
    const mailOptions = {
        from: 'fmarcos.23@gmail.com',
        to: email,
        subject: 'Confirmación de registro',
        text: `Hola ${nombre},\n\nGracias por registrarte. Por favor, 
                confirma tu correo electrónico haciendo clic en el siguiente enlace:
                \n\n${process.env.URL}/confirmar?email=${email}\n\nSaludos,\nEquipo de Soporte`
    };

    try {
        await transporter.sendMail(mailOptions);
        console.log('Correo de confirmación enviado');
    } catch (error) {
        console.error('Error al enviar el correo de confirmación:', error);
    }
}

//controlador para recibir el email de confirmación y autenticar el usuario antes registrado
const confirmarCorreo = async (req, res) => {
    const { email } = req.query;

    try {
        const usuario = await Usuario.findOneAndUpdate({ email }, { confirmado: true });
        if (!usuario) {
            return res.status(400).json({
                msg: 'El correo electrónico no está registrado'
            });
        }
        res.json({ msg: 'Correo confirmado' });
    }
    catch (error) {
        console.error('Error al confirmar el correo:', error);
        res.status(500).json({
            msg: 'Error al confirmar el correo'
        });
    }
}

//registrarse
const registrarse = async (req, res) => {
    const { nombre, apellido, email, password, direccion, telefono, isAdmin } = req.body;

    //busco si ya esxiste el email
    const usuario = await Usuario.find({ email });
    if (usuario.email) {
        return res.status(400).json({
            msg: 'El email ya esta registrado'
        });
    }

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
    await nuevoUsuario.save();

    // Enviar correo de confirmación
    //await enviarCorreoConfirmacion(email, nombre);

    res.json({ msg: 'Usuario creado' });
}

//trae usuarios 
const traerUsuarios = async (req, res) => {
    try {
        const usuarios = await Usuario.find();
        res.json(usuarios);
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

        res.json(user);
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
    const { id } = req.params;
    const { nombre, apellido, email, password, direccion, telefono, isAdmin } = req.body;

    const usuario = await Usuario.findByIdAndUpdate(id, {
        nombre,
        apellido,
        email,
        password,
        direccion,
        telefono,
        isAdmin
    });

    if (!usuario) {
        return res.status(404).json({
            msg: 'Usuario no encontrado'
        });
    }

    res.json({ msg: 'Usuario modificado' });
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

module.exports = {
    registrarse,
    traerUsuarios,
    traerUsuario,
    modificarUsuario,
    eliminarUsuario,
}