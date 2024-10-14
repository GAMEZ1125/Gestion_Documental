'use strict';
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Workflows', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      id_documento: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: { model: 'Documentos', key: 'id' },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
      },
      estado: {
        type: Sequelize.STRING,
        allowNull: false,
        defaultValue: 'En revisión',
      },
      asignado_a: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      fecha_limite: {
        type: Sequelize.DATE,
      },
      comentarios: {
        type: Sequelize.TEXT,
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('Workflows');
  },
};
