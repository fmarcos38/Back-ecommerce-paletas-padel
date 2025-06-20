const Usuario = require('../models/usuario');
const CryptoJS = require('crypto-js');

//registrarse
const registrarse = async (req, res) => {
    const { nombre, apellido, dni, email, password, direccion, telefono,  } = req.body; 

    //busco si ya esxiste el email
    const usuario = await Usuario.findOne({ email });
    if (usuario) {
        return res.status(400).json({ msg: 'El email ya esta registrado' });
    } else {
        //cifro pass
        const passwordCifrado = CryptoJS.AES.encrypt(
            password,
            process.env.PASS_SEC
        ).toString();

        const nuevoUsuario = await Usuario.create({
            nombre,
            apellido,
            dni,
            email,
            password: passwordCifrado,
            direccion,
            telefono,
        });
        
        //envio de email de confirmación
        //enviarCorreoConfirmacion(email, nombre);

        await nuevoUsuario.save();
        return res.status(200).json({ msg:'success' });
    }
}

module.exports = { registrarse };