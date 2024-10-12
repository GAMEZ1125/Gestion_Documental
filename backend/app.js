// app.js
const express = require('express');
const sequelize = require('./config/database');  // Importar la configuración de Sequelize
require('dotenv').config();  // Cargar variables de entorno

const app = express();

// Middleware para manejar JSON
app.use(express.json());

// Probar conexión a la base de datos
sequelize.authenticate()
  .then(() => console.log('Conectado a la base de datos MySQL'))
  .catch(err => console.error('Error conectando a la base de datos:', err));

// Ruta básica de prueba
app.get('/', (req, res) => {
  res.send('Servidor funcionando correctamente');
});

// Iniciar el servidor
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Servidor corriendo en el puerto ${PORT}`);
});
