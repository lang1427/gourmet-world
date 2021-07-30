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
    await queryInterface.bulkInsert('users_info', [
      {
        avatar: '/public/images/administration.png',
        sex: '男',
        birthprovince: '',
        birthcity: '',
        createdAt: '2021-02-11 02:13:25'
      },
      {
        avatar: 'https://i5.meishichina.com/data/avatar/012/75/46/92_avatar_big.jpg?x-oss-process=style/c80&v=2021073015',
        sex: '男',
        birthprovince: '',
        birthcity: '',
        createdAt: '2021-04-14 14:09:03'
      },
      {
        avatar: 'https://i5.meishichina.com/data/avatar/010/60/20/29_avatar_big.jpg?x-oss-process=style/c180&v=20210730',
        sex: '女',
        birthprovince: '',
        birthcity: '',
        createdAt: '2021-04-25 17:09:13'
      },
      {
        avatar: 'https://i5.meishichina.com/data/avatar/007/79/68/37_avatar_big.jpg?x-oss-process=style/c180&v=20210730',
        sex: '女',
        birthprovince: '',
        birthcity: '',
        createdAt: '2021-05-02 14:16:46'
      },
      {
        avatar: 'https://i5.meishichina.com/data/avatar/008/61/87/30_avatar_big.jpg?x-oss-process=style/c180&v=2021073016',
        sex: '女',
        birthprovince: '',
        birthcity: '',
        createdAt: '2021-05-05 10:10:05'
      },
      {
        avatar: 'https://i5.meishichina.com/data/avatar/010/87/80/13_avatar_big.jpg?x-oss-process=style/c180&v=2021073016',
        sex: '女',
        birthprovince: '',
        birthcity: '',
        createdAt: '2021-05-18 15:12:17'
      },
      {
        avatar: 'https://i5.meishichina.com/data/avatar/010/88/52/74_avatar_big.jpg?x-oss-process=style/c180&v=20210730',
        sex: '女',
        birthprovince: '',
        birthcity: '',
        createdAt: '2021-05-29 19:10:53'
      },
      {
        avatar: 'https://i5.meishichina.com/data/avatar/001/80/65/50_avatar_big.jpg?x-oss-process=style/c180&v=20210730',
        sex: '女',
        birthprovince: '',
        birthcity: '',
        createdAt: '2021-06-01 06:08:11'
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
    await queryInterface.bulkDelete('users_info', null, {});
  }
};
