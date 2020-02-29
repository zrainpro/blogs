'use strict';

/**
 * @param {Egg.Application} app - egg application
 */
module.exports = app => {
  const { router, controller } = app;
  // 登录注册
  router.post('/user/register', controller.user.register); // 注册
  router.post('/login', controller.user.login); // 登录
  router.post('/loginout', controller.user.loginout); // 登出
  router.post('/user/modify', controller.user.updateUserInfo); // 修改用户信息
  // 分类目录
  router.get('/category/list', controller.category.getList); // 获取分类目录
  router.get('/category/list/all', controller.category.getAllList); // 获取全部分类
  router.post('/category/patch', controller.category.insertCategory); // 添加或者更新分类目录
  router.post('/category/:id/status', controller.category.enabledCategory); // 启用/禁用分类
  // 评论
  router.get('/comment/:id/list', controller.comment.getComments); // 获取文章评论
  router.post('/comment/create', controller.comment.addComment); // 添加评论
  router.post('/comment/:id/like', controller.comment.likeComment); // 点赞评论
  router.post('/comment/:id/dislike', controller.comment.dislikeComment); // 点踩评论
  // 文章
  router.post('/article/patch', controller.article.patchArticle); // 创建修改文章
  router.get('/article/:id/detail', controller.article.getDetail); // 获取文章详情
  router.get('/article/list', controller.article.getList); // 获取文章列表
  router.post('/article/:id/like', controller.article.likeArticle); // 点赞文章
  router.post('/article/:id/dislike', controller.article.dislikeArticle); // 点踩文章
  // 代理请求防止跨域
  router.post('/proxy', controller.proxy.index);
};
