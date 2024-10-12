// app.js
const express = require('express');
const cors = require('cors'); // Importar cors
const authRoutes = require('./routes/authRoutes');
const documentRoutes = require('./routes/documentRoutes');

const app = express();

// Habilitar CORS para todas las solicitudes
app.use(cors());

// Middleware para manejar JSON
app.use(express.json());

// Rutas de autenticación
app.use('/api/auth', authRoutes);

// Rutas para la gestión de documentos
app.use('/api/documents', documentRoutes);

// Iniciar el servidor
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Servidor corriendo en el puerto ${PORT}`);
});
