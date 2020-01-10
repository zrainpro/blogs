'use strict';

/**
 * @param {Egg.Application} app - egg application
 */
module.exports = app => {
  const { router, controller } = app;
  // 登录注册
  router.post('/user/register', controller.user.register); // 注册
  router.post('/login', controller.user.login); // 登录
  router.post('/user/modify', controller.user.updateUserInfo); // 修改用户信息
  // 分类目录
  router.get('/category/list', controller.Category.getList); // 获取分类目录
  router.post('/category/patch', controller.Category.insertCategory); // 添加或者更新分类目录
  // 评论
  // 文章
};
