// models/Workflow.js
const { DataTypes } = require('sequelize');
const sequelize = require('../config/database'); // Asegúrate de que esto apunta a tu conexión

const Workflow = sequelize.define('Workflow', {
  id_documento: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: { model: 'Documentos', key: 'id' },
  },
  estado: {
    type: DataTypes.STRING,
    allowNull: false,
    defaultValue: 'En revisión', // Estado inicial
  },
  asignado_a: {
    type: DataTypes.STRING,
    allowNull: false, // Usuario asignado
  },
  fecha_limite: {
    type: DataTypes.DATE,
    allowNull: true,
  },
  comentarios: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
}, {
  timestamps: true,
});

module.exports = Workflow;
