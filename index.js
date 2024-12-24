const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const dbConnection = require('./src/config/db');
dotenv.config();
//importo rutas
const userRoutes = require('./src/routes/userio');
const app = express();

//middlewares
app.use(express.json());
app.use(cors());

//config db
dbConnection();

//rutas
app.use('/user', userRoutes);

//puerto
const PORT = process.env.PORT || 3001;

//inicializo servidor
app.listen(PORT, () => {
    console.log(`Servidor corriendo en puerto ${PORT}`);
});