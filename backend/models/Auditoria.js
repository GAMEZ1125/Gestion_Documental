// models/Auditoria.js
const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const Documento = require('./Documento');

const Auditoria = sequelize.define('Auditoria', {
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
  resultado: {
    type: DataTypes.STRING(20),
    allowNull: false,
  },
  comentarios: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
  ruta_archivo_auditoria: {
    type: DataTypes.STRING(255),
    allowNull: false,
  },
}, {
  timestamps: true,
  tableName: 'auditorias',
});

Auditoria.belongsTo(Documento, { foreignKey: 'id_documento', onDelete: 'CASCADE' });

module.exports = Auditoria;
