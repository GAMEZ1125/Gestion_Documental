// models/Documento.js
const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const Area = require('./Area');
const TipoDocumento = require('./TipoDocumento');

const Documento = sequelize.define('Documento', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  titulo: {
    type: DataTypes.STRING(100),
    allowNull: false,
  },
  descripcion: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
  contenido: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
  version: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  estado: {
    type: DataTypes.STRING(20),
    allowNull: false,
  },
  id_area: {
    type: DataTypes.INTEGER,
    references: {
      model: Area,
      key: 'id',
    },
    allowNull: false,
  },
  id_tipo_documento: {
    type: DataTypes.INTEGER,
    references: {
      model: TipoDocumento,
      key: 'id',
    },
    allowNull: false,
  },
  ruta_archivo: {
    type: DataTypes.STRING(255),
    allowNull: false,
  },
}, {
  timestamps: true,
  tableName: 'documentos',
});

Documento.belongsTo(Area, { foreignKey: 'id_area', onDelete: 'CASCADE' });
Documento.belongsTo(TipoDocumento, { foreignKey: 'id_tipo_documento', onDelete: 'CASCADE' });

module.exports = Documento;
