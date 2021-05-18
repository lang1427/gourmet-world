'use strict';

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
    await queryInterface.bulkInsert('category', [
      { p_id: 0, c_name: '菜谱大全' },
      { p_id: 0, c_name: '食材大全' },
      { p_id: 0, c_name: '饮食健康' },
      { p_id: 0, c_name: '专题专区' },
      { p_id: 1, c_name: '一周热门/近7天最受欢迎' },
      { p_id: 1, c_name: '人气菜肴/超过50人收藏' },
      { p_id: 1, c_name: '春季食谱/看看大家在吃啥' },
      { p_id: 1, c_name: '早餐/像国王一样早餐' },
      { p_id: 1, c_name: '高颜值/颜控专用通道' },
      { p_id: 1, c_name: '凉菜/精选2600道' },
      { p_id: 1, c_name: '热菜/精选42500道' },
      { p_id: 1, c_name: '主食/精选18000道' },
      { p_id: 1, c_name: '小吃/精选11000道' },
      { p_id: 1, c_name: '酱泡腌菜/精选700道' },
      { p_id: 1, c_name: '新秀菜谱/最新的优秀菜谱' },
      { p_id: 1, c_name: '所有分类/美天的神奇饭盒' },  
      { p_id: 2, c_name: '秋葵/新晋VC王' },
      { p_id: 2, c_name: '西红柿/共3160道菜谱' },
      { p_id: 2, c_name: '黑木耳/百搭配菜，防雾霾' },
      { p_id: 2, c_name: '小龙虾/红到勾心，辣到流泪' },
      { p_id: 2, c_name: '螃蟹/全民爆红' },
      { p_id: 2, c_name: '鸡翅/共1156道菜谱' },
      { p_id: 2, c_name: '肉禽蛋/共231种' },
      { p_id: 2, c_name: '水产品/共288种' },
      { p_id: 2, c_name: '蔬菜瓜菌/共473种' },
      { p_id: 2, c_name: '鲜果干果/共196种' },
      { p_id: 2, c_name: '米面豆乳/共180种' },
      { p_id: 2, c_name: '营养排行/看看谁TOP!' },
      { p_id: 3, c_name: '最新推荐/饮食健康知识' },
      { p_id: 3, c_name: '饮食常识/健康知识' },
      { p_id: 3, c_name: '瘦身美容/应该知道的小知识' },
      { p_id: 3, c_name: '气血双补/食疗专题' },
      { p_id: 3, c_name: '痛经/痛经吃什么好' },
      { p_id: 3, c_name: '驱寒暖身/有温度的食材' },
      { p_id: 3, c_name: '对抗雾霾/雾霾天吃什么' },
      { p_id: 3, c_name: '失眠/失眠吃什么好' },
      { p_id: 3, c_name: '食疗食补/常见症状的食疗专题' },
      { p_id: 4, c_name: '菜单/由网友创建的专题' },
      { p_id: 4, c_name: '家常菜谱/居家必备368款' },
      { p_id: 4, c_name: '食疗食补/共212个专题' }
    ]
    , {});
  },

  down: async (queryInterface, Sequelize) => {
    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('People', null, {});
     */
     await queryInterface.bulkDelete('category', null, {});
  }
};
