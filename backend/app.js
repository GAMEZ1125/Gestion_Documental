// app.js
const express = require('express');
const cors = require('cors');
const path = require('path'); // Asegúrate de importar 'path'
const userRoutes = require('./routes/userRoutes');
const authRoutes = require('./routes/authRoutes');
const areaRoutes = require('./routes/areaRoutes');
const tipoDocumentoRoutes = require('./routes/tipoDocumentoRoutes');
const documentRoutes = require('./routes/documentRoutes');
const auditoriaDocumentoRoutes = require('./routes/auditoriaDocsRoutes');
const usuarioAreaRoutes = require('./routes/usuarioAreaRoutes');
const emailConfigRoutes = require('./routes/emailConfig');

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
app.use('/api/auditorias', auditoriaDocumentoRoutes);
app.use('/api/usuarios-areas', usuarioAreaRoutes);
app.use('/api', emailConfigRoutes);

const PORT = process.env.PORT || 4005;
app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});
