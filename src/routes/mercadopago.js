const express = require('express');
const { crearPreferencia, recibirNotificaciones, paymentMP } = require('../controllers/mercadopago');

const router = express.Router();

//router.post('/crear-preferencia', crearPreferencia);

//router.post('/notificaciones', recibirNotificaciones);

router.post('/crear-preferencia', paymentMP);

module.exports = router;