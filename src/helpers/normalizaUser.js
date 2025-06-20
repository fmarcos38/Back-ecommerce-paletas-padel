const { use } = require("../routes/usuario");

//normaliza usuario
const normalizaUser = (user) => {
    return {
        id: user._id,
        nombre: user.nombre,
        apellido: user.apellido,
        dni: user.dni, 
        email: user.email, 
        //password: user.password, 
        telefono: user.telefono, 
        direccion: user.direccion, 
        favoritos: user.favoritos, 
        isAdmin: user.isAdmin, 
        comentarios: user.comentarios, 
    };
};
//normaliza usuarios
const normalizaUsuarios = (usuarios) => {
    return usuarios.map(normalizaUser);
};

module.exports = {
    normalizaUser,
    normalizaUsuarios
};