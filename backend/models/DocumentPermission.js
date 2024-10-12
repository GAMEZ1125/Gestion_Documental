// models/DocumentPermission.js
const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const Document = require('./Documento');
const User = require('./Usuario');

const DocumentPermission = sequelize.define('DocumentPermission', {
  permiso: {
    type: DataTypes.ENUM('lectura', 'escritura', 'aprobacion'),
    allowNull: false,
  },
}, {
  timestamps: true,
});

// Relación: un permiso está asociado a un documento y a un usuario
DocumentPermission.belongsTo(Document, { foreignKey: 'document_id', onDelete: 'CASCADE' });
DocumentPermission.belongsTo(User, { foreignKey: 'user_id', onDelete: 'CASCADE' });

module.exports = DocumentPermission;
