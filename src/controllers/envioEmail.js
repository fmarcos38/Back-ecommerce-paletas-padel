const Usuario = require('../models/usuario');
const nodemailer = require('nodemailer');

// Configuración del transporte de nodemailer
const transporter = nodemailer.createTransport({
    service: 'hotmail',
    auth: {
      user: process.env.EMAIL_ADMIN, // Tu dirección de correo
      pass: process.env.EMAIL_PASS,  // Contraseña de tu correo
    },
    tls: {
      rejectUnauthorized: false, // Permitir certificados autofirmados
    },
});

// Enviar correo de confirmación
const enviarCorreoConfirmacion = async (email, nombre) => {
    const urlConfirmacionBackend = `usuario/confirmar?email=${email}`; //cambiar con la del deploy
    const mailOptions = {
        from: 'patopadel@hotmail.com',
        to: email,
        subject: 'Confirmación de registro',
        text: `Hola ${nombre},\n\nGracias por registrarte. Por favor, 
                confirma tu correo electrónico haciendo clic en el siguiente enlace:
                \n\n<a href=${urlConfirmacionBackend}>Confirmar correo</a>
                \n\nSaludos,\nEquipo de Soporte`
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

module.exports = { 
    enviarCorreoConfirmacion, 
    confirmarCorreo 
};