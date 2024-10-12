// models/VersionDocumento.js
const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const Documento = require('./Documento');

const VersionDocumento = sequelize.define('VersionDocumento', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  id_documento: {
    type: DataTypes.INTEGER,
    references: {
      model: Documento,
      key: 'id',
    },
    allowNull: false,
  },
  version: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  ruta_archivo: {
    type: DataTypes.STRING(255),
    allowNull: false,
  },
  descripcion: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
}, {
  timestamps: true,
  tableName: 'versiones_documentos',
});

VersionDocumento.belongsTo(Documento, { foreignKey: 'id_documento', onDelete: 'CASCADE' });

module.exports = VersionDocumento;
