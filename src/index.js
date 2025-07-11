const express = require('express');
const cors = require('cors');
require('dotenv').config();

const app = express();

// --- DEPURACIÓN DE CORS ---
// Imprimimos en los logs de Render para ver qué valor está leyendo.
console.log("--- INICIANDO CONFIGURACIÓN DE CORS ---");
console.log("FRONTEND_URL desde process.env:", process.env.FRONTEND_URL);

// --- CONFIGURACIÓN DE CORS PARA PRODUCCIÓN ---
const allowedOrigins = [
  'http://localhost:5173', // Para desarrollo local
  process.env.FRONTEND_URL  // Para el frontend en Vercel
];

// Filtramos cualquier valor undefined o nulo de la lista
const filteredAllowedOrigins = allowedOrigins.filter(Boolean);

console.log("Lista de orígenes permitidos (allowedOrigins):", filteredAllowedOrigins);
console.log("--- FIN DE CONFIGURACIÓN DE CORS ---");

const corsOptions = {
  origin: function (origin, callback) {
    // Permite peticiones sin 'origin' (como las de Postman) y las de la lista.
    if (!origin || filteredAllowedOrigins.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      console.error("CORS Error: Origen no permitido:", origin);
      callback(new Error('Not allowed by CORS'));
    }
  }
};

app.use(cors(corsOptions));

// --- MIDDLEWARES ---
app.use(express.json());

// --- RUTAS ---
const taskRoutes = require('./routes/taskRoutes');
app.use('/api/tasks', taskRoutes);

const userRoutes = require('./routes/userRoutes');
app.use('/api/users', userRoutes);

// --- INICIO DEL SERVIDOR ---
const PORT = process.env.PORT || 3306;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
