const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const dbConnection = require('./src/config/db');
dotenv.config();
//importo rutas
const userRoutes = require('./src/routes/usuario');
const productoRoutes = require('./src/routes/producto');

const app = express();

//middlewares
app.use(express.json());
app.use(cors());

//config db
dbConnection();

//rutas
app.use('/usuario', userRoutes);
app.use('/producto', productoRoutes);

//puerto
const PORT = process.env.PORT || 3002;

//inicializo servidor
app.listen(PORT, () => {
    console.log(`Servidor corriendo en puerto ${PORT}`);
});