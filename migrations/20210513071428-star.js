'use strict';

module.exports = {
    up: async (queryInterface, Sequelize) => {
        queryInterface.createTable('star', {
            id: {
                allowNull: false,
                autoIncrement: true,
                primaryKey: true,
                type: Sequelize.INTEGER
            },
            user_id: {
                type: Sequelize.INTEGER,
                allowNull: false,
                comment: '用户id'
            },
            g_id: {
                type: Sequelize.INTEGER,
                allowNull: false,
                comment: '菜谱id'
            },
            createdAt: {
                allowNull: true,
                type: Sequelize.DATE
            },
            updatedAt: {
                allowNull: true,
                type: Sequelize.DATE
            }
        }, {
            charset: 'utf8mb4',
            collate: "utf8mb4_bin"
        })
    },
    down: async (queryInterface, Sequelize) => {
        await queryInterface.dropTable('star')
    }
}