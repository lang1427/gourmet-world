'use strict'
module.exports = {
    up: async (queryInterface, Sequelize) => {
        await queryInterface.bulkInsert('star', [
            {
                user_id: 2,
                g_id: 2
            },
            {
                user_id: 1,
                g_id: 1
            },
            {
                user_id: 3,
                g_id: 3
            }
        ], {});
    },
    down: async (queryInterface, Sequelize) => {
        await queryInterface.bulkDelete('star', null, {});
    }
}