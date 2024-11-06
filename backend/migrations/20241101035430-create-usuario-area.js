// migrations/[timestamp]-create-usuario-area.js
'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('usuario_area', {
      id_usuario: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'usuarios',
          key: 'id',
        },
        onDelete: 'CASCADE',
      },
      id_area: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'areas',
          key: 'id',
        },
        onDelete: 'CASCADE',
      },
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('usuario_area');
  }
};
