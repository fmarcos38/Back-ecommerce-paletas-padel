const express = require('express');
const router = express.Router();
const {
    crearPreferencia,
    recibirWebhook,
    estadoPago
} = require('../controllers/mercadoPago2');

router.post('/crear-preferencia', crearPreferencia);
router.post('/webhook', recibirWebhook);
router.get('/estado/:id', estadoPago);

module.exports = router;
