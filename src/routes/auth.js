const express = require('express');
const { login, loginGoogle } = require('../controllers/auth');

const router = express.Router();

//login clásico
router.post('/login', login);

//login con google
router.post('/login/google', loginGoogle);

module.exports = router;