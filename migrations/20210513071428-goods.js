'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    /**
     * Add altering commands here.
     *
     * Example:
     * await queryInterface.createTable('users', { id: Sequelize.INTEGER });
     */
    await queryInterface.createTable('goods', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      g_name: {
        type: Sequelize.STRING(30),
        allowNull: false,
        comment: '菜谱名称'
      },
      img: {
        type: Sequelize.STRING,
        allowNull: false,
        comment: '菜谱图片'
      },
      user_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        comment: '用户id'
      },
      desc: {
        type: Sequelize.STRING(500),
        allowNull: false,
        default: '',
        comment: '菜谱描述'
      },
      difficulty: {
        type: Sequelize.ENUM(['简单', '初级', '中级', '高级']),
        allowNull: false,
        comment: '制作难度'
      },
      zhuliao: {
        type: Sequelize.STRING,
        allowNull: false,
        default: '',
        comment: '主料'
      },
      fuliao: {
        type: Sequelize.STRING,
        allowNull: false,
        default: '',
        comment: '辅料'
      },
      tiaoliao: {
        type: Sequelize.STRING,
        allowNull: false,
        default: '',
        comment: '调料'
      },
      category_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        comment: '分类类别'
      },
      status: {
        type: Sequelize.TINYINT,
        allowNull: false,
        default: 3,
        comment: '审核状态'
      },
      status_mes: {
        type: Sequelize.STRING(100),
        allowNull: true,
        comment: "审核不通过描述信息"
      },
      like_count: {
        type: Sequelize.INTEGER,
        allowNull: false,
        default: 0,
        comment: '点赞数量'
      },
      comment_count: {
        type: Sequelize.INTEGER,
        allowNull: false,
        default: 0,
        comment: '评论数量'
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
    });
  },

  down: async (queryInterface, Sequelize) => {
    /**
     * Add reverting commands here.
     *
     * Example:
     * await queryInterface.dropTable('users');
     */
    await queryInterface.dropTable('goods');
  }
};
