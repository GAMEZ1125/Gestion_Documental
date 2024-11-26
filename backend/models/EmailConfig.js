// models/EmailConfig.js
const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const EmailConfig = sequelize.define('EmailConfig', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  host: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  port: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  secure: {
    type: DataTypes.BOOLEAN,
    defaultValue: true,
  },
  user: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  from: {
    type: DataTypes.STRING,
    allowNull: false,
  },
}, {
  tableName: 'email_configs',
  timestamps: true,
});

module.exports = EmailConfig;
