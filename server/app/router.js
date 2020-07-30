'use strict';

/**
 * @param {Egg.Application} app - egg application
 */
module.exports = app => {
  const { router, controller } = app;
  process.selfData = {
    router,
    controller,
  };
  // 登录注册
  router.post('/user/register', controller.user.register); // 注册
  router.post('/login', controller.user.login); // 登录
  router.post('/loginout', controller.user.loginout); // 登出
  router.post('/user/modify', controller.user.updateUserInfo); // 修改用户信息
  router.get('/needinit', controller.user.needInit); // 是否需要初始化
  router.post('/init', controller.user.init); // 初始化系统
  // 分类目录
  router.get('/category/list', controller.category.getList); // 获取分类目录
  router.get('/category/list/all', controller.category.getAllList); // 获取全部分类
  router.post('/category/patch', controller.category.insertCategory); // 添加或者更新分类目录
  router.post('/category/:id/status', controller.category.enabledCategory); // 启用/禁用分类
  // 评论
  router.get('/comment/:id/list', controller.comment.getComments); // 获取文章评论
  router.post('/comment/list', controller.comment.getCommentsAll); // 后台获取评论信息
  router.post('/comment/create', controller.comment.addComment); // 添加评论
  router.post('/comment/:id/like', controller.comment.likeComment); // 点赞评论
  router.post('/comment/:id/dislike', controller.comment.dislikeComment); // 点踩评论
  router.post('/comment/enabled', controller.comment.enabledComment); // 批量启用 / 禁用评论
  router.post('/comment/delete', controller.comment.deleteComment); // 批量深处评论
  // 文章
  router.post('/article/patch', controller.article.patchArticle); // 创建修改文章
  router.post('/article/preserve', controller.article.keepArticle); // 暂存文章
  router.get('/article/:id/detail', controller.article.getDetail); // 获取文章详情
  router.get('/article/:id/back/detail', controller.article.getBackDetail); // 获取文章详情
  router.get('/article/:id/like', controller.article.getLike); // 获取文章点赞点踩数
  router.get('/article/list', controller.article.getList); // 获取文章列表
  router.post('/article/list/all', controller.article.getListAll); // 获取所有文章列表, 包含被禁用的
  router.post('/article/:id/like', controller.article.likeArticle); // 点赞文章
  router.post('/article/:id/dislike', controller.article.dislikeArticle); // 点踩文章
  router.post('/article/:id/disabled', controller.article.disabledArticle); // 启用禁用文章
  router.post('/article/:id/delete', controller.article.deleteArticle); // 删除文章
  // 代理请求防止跨域
  router.post('/proxy', controller.proxy.index);
  // 存储json
  router.get('/common/json', controller.common.get); // 获取json
  router.post('/common/json', controller.common.patch); // 存储json
  router.get('/some', controller.common.some);
  // setTimeout(() => {
  //   console.log('添加上了');
  //   router.get('/some2', controller.common.some2);
  // }, 10000);
};
