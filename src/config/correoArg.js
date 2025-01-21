const axios = require('axios');

const correoArgentinoAPI = axios.create({
    baseURL: process.env.CORREO_ARGENTINO_API_URL,
    headers: {
        Authorization: `Bearer ${process.env.CORREO_ARGENTINO_API_KEY}`,
        'Content-Type': 'application/json'
    }
});

module.exports = correoArgentinoAPI;
