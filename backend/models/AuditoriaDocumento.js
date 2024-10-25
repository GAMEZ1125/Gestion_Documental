// models/AuditoriaDocumento.js
const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const Usuario = require('./Usuario');
const Documento = require('./Documento');

const AuditoriaDocumento = sequelize.define('AuditoriaDocumento', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  accion: {
    type: DataTypes.STRING(20), // "Creación" o "Edición"
    allowNull: false,
  },
  observaciones: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
  fecha: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
  },
  id_usuario: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: Usuario,
      key: 'id',
    },
  },
  id_documento: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: Documento,
      key: 'id',
    },
  },
}, {
  timestamps: false,
  tableName: 'auditoria_documentos',
});

module.exports = AuditoriaDocumento;
