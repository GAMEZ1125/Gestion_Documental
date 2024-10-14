// models/Notification.js
const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Notification = sequelize.define('Notification', {
  id_usuario: {
    type: DataTypes.INTEGER,
    allowNull: false, // ID del usuario que recibirá la notificación
  },
  mensaje: {
    type: DataTypes.TEXT,
    allowNull: false, // Contenido de la notificación
  },
  leido: {
    type: DataTypes.BOOLEAN,
    defaultValue: false, // Notificación sin leer por defecto
  },
}, {
  timestamps: true,
});

module.exports = Notification;
