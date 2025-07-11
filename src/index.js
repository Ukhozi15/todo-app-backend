const express = require('express');
const cors = require('cors');
require('dotenv').config();

const app = express();

// --- CONFIGURACIÓN DE CORS PARA PRODUCCIÓN ---
// Esta lista de orígenes permitidos es la clave.
const allowedOrigins = [
  'http://localhost:5173', // Tu frontend en desarrollo
  process.env.FRONTEND_URL  // La URL de tu frontend en Vercel (que leerá desde las variables de entorno)
];

const corsOptions = {
  origin: function (origin, callback) {
    // Permite peticiones sin 'origin' (como las de Postman o apps móviles)
    // y las que están en nuestra lista de permitidos.
    if (!origin || allowedOrigins.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  }
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
// CAMBIO: Se actualiza el puerto por defecto a 3306.
const PORT = process.env.PORT || 3306;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
