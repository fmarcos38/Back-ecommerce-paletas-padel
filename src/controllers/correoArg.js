const correoArgentinoAPI = require('../config/correoArg');

// Cotizar un envío
const cotizarEnvio = async (req, res) => {
    const { origen, destino, peso } = req.body; // Datos enviados desde el frontend
    try {
        const response = await correoArgentinoAPI.post('/cotizar', {
            origen,
            destino,
            peso
        });
        res.json(response.data);
    } catch (error) {
        console.error('Error al cotizar envío:', error.response?.data || error.message);
        res.status(500).json({ message: 'Error al cotizar envío' });
    }
};

// Crear un envío
const crearEnvio = async (req, res) => {
    const { datosEnvio } = req.body; // Información del envío proporcionada por el cliente
    try {
        const response = await correoArgentinoAPI.post('/crear-envio', datosEnvio);
        res.json(response.data);
    } catch (error) {
        console.error('Error al crear envío:', error.response?.data || error.message);
        res.status(500).json({ message: 'Error al crear envío' });
    }
};

// Obtener estado del envío
const estadoEnvio = async (req, res) => {
    const { numeroTracking } = req.params; // Número de tracking proporcionado por el cliente
    try {
        const response = await correoArgentinoAPI.get(`/estado-envio/${numeroTracking}`);
        res.json(response.data);
    } catch (error) {
        console.error('Error al obtener estado del envío:', error.response?.data || error.message);
        res.status(500).json({ message: 'Error al obtener estado del envío' });
    }
};

module.exports = {
    cotizarEnvio,
    crearEnvio,
    estadoEnvio
};
