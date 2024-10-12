// models/Usuario.js
const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Usuario = sequelize.define('Usuario', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  nombre: {
    type: DataTypes.STRING(50),
    allowNull: false,
  },
  apellido: {
    type: DataTypes.STRING(50),
    allowNull: false,
  },
  correo_electronico: {
    type: DataTypes.STRING(100),
    allowNull: false,
  },
  contraseña: {
    type: DataTypes.STRING(255),
    allowNull: false,
  },
  rol: {
    type: DataTypes.STRING(20),
    allowNull: false,
  },
}, {
  timestamps: true,
  tableName: 'usuarios',
});

module.exports = Usuario;
