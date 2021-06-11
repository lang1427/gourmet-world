'use strict'
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.bulkInsert('comments', [
      {
        user_id: 2,
        g_id: 2,
        comment: '根据这个手法做出来的，好好吃哦！'
      },
      {
        user_id: 1,
        g_id: 1,
        comment: '根据这个手法做出来的，好好吃哦！'
      },
      {
        user_id: 3,
        g_id: 3,
        comment: '根据这个手法做出来的，好好吃哦！'
      }
    ], {});
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('comments', null, {});
  }
}