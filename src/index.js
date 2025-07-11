const express = require('express');
const cors = require('cors');
require('dotenv').config();

const app = express();

// --- CONFIGURACIÓN DE CORS ---
// Es importante que esta configuración vaya ANTES de las rutas.
// Esto le dice al servidor que acepte peticiones específicamente
// desde el origen de tu aplicación de React en Vite.
const corsOptions = {
  origin: 'http://localhost:5173', // El puerto donde corre tu app de Vite/React
  optionsSuccessStatus: 200
};

app.use(cors(corsOptions));

// --- MIDDLEWARES ---
// Este middleware es para que Express pueda entender el JSON en el cuerpo de las peticiones.
app.use(express.json());

// --- RUTAS ---
// Aquí se definen las rutas de tu API.
const taskRoutes = require('./routes/taskRoutes');
app.use('/api/tasks', taskRoutes);

const userRoutes = require('./routes/userRoutes');
app.use('/api/users', userRoutes);

// --- INICIO DEL SERVIDOR ---
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
