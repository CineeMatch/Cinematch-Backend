'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('initstate', {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        allowNull: false
      },
      initialized: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: false
      }
    });

    await queryInterface.bulkInsert('initstate', [
      { id: 1, initialized: false }
    ]);
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('initstate');
  }
};
