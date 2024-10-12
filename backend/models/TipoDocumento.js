// models/TipoDocumento.js
const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const TipoDocumento = sequelize.define('TipoDocumento', {
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
  tableName: 'tipos_documentos',
});

module.exports = TipoDocumento;
