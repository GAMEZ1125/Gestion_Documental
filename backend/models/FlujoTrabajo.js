// models/FlujoTrabajo.js
const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const FlujoTrabajo = sequelize.define('FlujoTrabajo', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  nombre: {
    type: DataTypes.STRING(50),
    allowNull: false,
  },
  descripcion: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
}, {
  timestamps: true,
  tableName: 'flujos_trabajo',
});

module.exports = FlujoTrabajo;
