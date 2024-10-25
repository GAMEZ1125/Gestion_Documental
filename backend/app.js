const express = require('express');
const cors = require('cors');
const path = require('path'); // Asegúrate de importar 'path'
const userRoutes = require('./routes/userRoutes');
const authRoutes = require('./routes/authRoutes');
const areaRoutes = require('./routes/areaRoutes');
const tipoDocumentoRoutes = require('./routes/tipoDocumentoRoutes');
const documentRoutes = require('./routes/documentRoutes');

const app = express();

app.use(cors());
app.use(express.json());

// Hacer pública la carpeta 'uploads' para servir los archivos
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Rutas de autenticación
app.use('/api/auth', authRoutes);

// Otras rutas
app.use('/api/users', userRoutes);
app.use('/api/areas', areaRoutes);
app.use('/api/tipos_documentos', tipoDocumentoRoutes);
app.use('/api/documents', documentRoutes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});
