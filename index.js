const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const dbConnection = require('./src/config/db');
dotenv.config();
//importo rutas
const authRoutes = require('./src/routes/auth');
const userRoutes = require('./src/routes/usuario');
const productoRoutes = require('./src/routes/producto');
const carritoRoutes = require('./src/routes/carrito');
const mercadopagoRoutes = require('./src/routes/mercadopago');
const correoArgRoutes = require('./src/routes/correoArg');

const app = express();

//middlewares
app.use(express.json());
app.use(cors());

//config db
dbConnection();

//rutas
app.use('/auth', authRoutes);
app.use('/usuario', userRoutes);
app.use('/producto', productoRoutes);
app.use('/carrito', carritoRoutes);
app.use('/mercadopago', mercadopagoRoutes);
app.use('/correoArg', correoArgRoutes);

//puerto
const PORT = process.env.PORT || 3002;

//inicializo servidor
app.listen(PORT, () => {
    console.log(`Servidor corriendo en puerto ${PORT}`);
});