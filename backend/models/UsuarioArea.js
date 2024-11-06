// models/UsuarioArea.js
const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const Usuario = require('./Usuario');
const Area = require('./Area');

const UsuarioArea = sequelize.define('UsuarioArea', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  id_usuario: {
    type: DataTypes.INTEGER,
    references: {
      model: Usuario,
      key: 'id',
    },
  },
  id_area: {
    type: DataTypes.INTEGER,
    references: {
      model: Area,
      key: 'id',
    },
  },
}, {
  timestamps: false,
  tableName: 'usuario_area',
});

// Definir las relaciones
UsuarioArea.belongsTo(Usuario, { foreignKey: 'id_usuario' });
UsuarioArea.belongsTo(Area, { foreignKey: 'id_area' });

module.exports = UsuarioArea;
