// sync.js
const sequelize = require('./config/database');
const Usuario = require('./models/Usuario');
const Area = require('./models/Area');
const Documento = require('./models/Documento');
const TipoDocumento = require('./models/TipoDocumento');
const Auditoria = require('./models/Auditoria');
const VersionDocumento = require('./models/VersionDocumento');
const FlujoTrabajo = require('./models/FlujoTrabajo');

sequelize.sync({ alter: true })  // Usamos 'alter' para evitar recrear tablas
  .then(() => {
    console.log('Base de datos sincronizada correctamente.');
  })
  .catch(err => {
    console.error('Error al sincronizar la base de datos:', err);
  });
