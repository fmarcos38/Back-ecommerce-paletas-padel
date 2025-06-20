const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const dbConnection = require('./src/config/db');
dotenv.config();
//importo rutas
const registrarseRoutes = require('./src/routes/registrarse');
const authRoutes = require('./src/routes/auth');
const userRoutes = require('./src/routes/usuario');
const productoRoutes = require('./src/routes/producto');
const carritoRoutes = require('./src/routes/carrito');
const mercadopagoRoutes = require('./src/routes/mercadopago');

const app = express();

//middlewares
app.use(express.json());
app.use(cors());

//config db
dbConnection();

//rutas
app.use('/registrarse', registrarseRoutes);
app.use('/auth', authRoutes);
app.use('/usuario', userRoutes);
app.use('/producto', productoRoutes);
app.use('/carrito', carritoRoutes);
app.use('/mercadopago', mercadopagoRoutes);

//puerto
const PORT = process.env.PORT || 3002;

//inicializo servidor
app.listen(PORT, () => {
    console.log(`Servidor corriendo en puerto ${PORT}`);
});