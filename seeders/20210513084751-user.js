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
        password: md5('admin'),
        createdAt:'2021-02-11 02:13:25'
      },
      {
        username: 'kanglang',
        password: md5('5201314'),
        createdAt:'2021-04-14 14:09:03'
      },
      {
        username: '琪_feXjZ8E2',
        password: md5('asfjkasipfnqwopiasf'),
        createdAt:'2021-04-25 17:09:13'
      },
      {
        username: '宸·羽',
        password: md5('asfasfqwfxv'),
        createdAt:'2021-05-02 14:16:46'
      },
      {
        username: '沙儿飞飞❉',
        password: md5('zxcvbnm'),
        createdAt:'2021-05-05 10:10:05'
      },
      {
        username: '小乙美食',
        password: md5('oqwknauishfmnas'),
        createdAt:'2021-05-18 15:12:17'
      },
      {
        username: 'RLing',
        password: md5('lkjaioqinka'),
        createdAt:'2021-05-29 19:10:53'
      },
      {
        username: '不做妖精好多年',
        password: md5('oqpekwrincnje'),
        createdAt:'2021-06-01 06:08:11'
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
