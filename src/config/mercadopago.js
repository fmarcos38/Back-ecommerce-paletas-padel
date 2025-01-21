const mercadopago = require('mercadopago');

// Configura tus credenciales de MercadoPago
mercadopago.configure({
    access_token: "TEST-7729981514903144-012015-d39f373f858f82c18c4b3744c1d24cbe-18517025",
});

module.exports = mercadopago;
