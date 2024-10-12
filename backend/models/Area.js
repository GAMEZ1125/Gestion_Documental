// models/Area.js
const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Area = sequelize.define('Area', {
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
  prefijo: {
    type: DataTypes.STRING(10),
    allowNull: false,
  },
}, {
  timestamps: true,
  tableName: 'areas',
});

module.exports = Area;
