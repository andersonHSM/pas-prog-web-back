'use strict';
module.exports = {
    up: (queryInterface, Sequelize) => {
        /*
          Add altering commands here.
          Return a promise to correctly handle asynchronicity.
    
          Example:
          */
        return queryInterface.createTable('jwt_blacklist', {
            id: { type: Sequelize.INTEGER, primaryKey: true, autoIncrement: true },
            token: {
                type: Sequelize.STRING,
                allowNull: false,
            },
            created_at: Sequelize.DATE,
            updated_at: Sequelize.DATE,
        });
    },
    down: (queryInterface, Sequelize) => {
        /*
          Add reverting commands here.
          Return a promise to correctly handle asynchronicity.
    
          Example:
          return queryInterface.dropTable('users');
        */
    },
};
