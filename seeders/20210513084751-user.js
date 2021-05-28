'use strict';
const md5 = require('md5') 
module.exports = {
  up: async (queryInterface, Sequelize) => {
    /**
     * Add seed commands here.
     *
     * Example:
     * await queryInterface.bulkInsert('People', [{
     *   name: 'John Doe',
     *   isBetaMember: false
     * }], {});
    */
    await queryInterface.bulkInsert('users', [
      {
        username: 'admin',
        password: md5('admin')
      },
      {
        username: 'kanglang',
        password: md5('5201314')
      },
      {
        username: '琪_feXjZ8E2',
        password: md5('asfjkasipfnqwopiasf')
      },
      {
        username: '宸·羽',
        password: md5('asfasfqwfxv')
      },
      {
        username: '沙儿飞飞❉',
        password: md5('zxcvbnm')
      },
      {
        username: '小乙美食',
        password: md5('oqwknauishfmnas')
      },
      {
        username: 'RLing',
        password: md5('lkjaioqinka')
      },
      {
        username: '不做妖精好多年',
        password: md5('oqpekwrincnje')
      }
    ], {});
  },

  down: async (queryInterface, Sequelize) => {
    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('People', null, {});
     */
    await queryInterface.bulkDelete('users', null, {});
  }
};
