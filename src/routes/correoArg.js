const express = require('express');
const { cotizarEnvio, crearEnvio, estadoEnvio } = require('../controllers/correoArg');

const router = express.Router();

router.post('/cotizar', cotizarEnvio);
router.post('/crear', crearEnvio);
router.get('/estado/:numeroTracking', estadoEnvio);

module.exports = router;
