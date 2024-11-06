// models/Area.js
const { Model, DataTypes } = require('sequelize');
const sequelize = require('../config/database');

class Area extends Model {}

Area.init({
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
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
    allowNull: true,
  },
}, {
  sequelize,
  modelName: 'Area',
});

Area.associate = (models) => {
  Area.hasMany(models.UsuarioArea, { foreignKey: 'id_area' });
};

module.exports = Area;
