
'use strict';
const pathToRegexp = require('path-to-regexp');
// 不需要登录的接口
const skipRouter = [
  '/common/json',
  '/init',
  '/needinit',
  '/login',
  '/user/register',
  '/category/list',
  '/comment/:id/list',
  '/comment/create',
  '/comment/:id/like',
  '/comment/:id/dislike',
  '/article/:id/detail',
  '/article/list',
  '/article/:id/like',
  '/article/:id/dislike',
  '/proxy',
  '/some',
  '/some2',
  '/statistics/address',
];

module.exports = () => {
  return async function body(ctx, next) {
    const canSkip = skipRouter.find(item => pathToRegexp.pathToRegexp(item).exec(ctx.path));
    // 登录校验
    if (!canSkip) {
      let user = ctx.session.user;
      let redirect = false;
      if (!user) {
        redirect = true;
      } else {
        user = JSON.parse(user);
        const result = await ctx.model.User.findOne({ _id: user.id }).select('user password');
        if (!result || result.user !== user.user || result.password !== user.password) {
          redirect = true;
        }
        // 登录是否超时, 超时时间 1天
        if (new Date().getTime() - user.time > 24 * 3600 * 1000) {
          redirect = true;
        }
      }
      if (redirect) {
        ctx.session.user = null;
        ctx.body = {
          code: 600,
        };
        return;
      }
    }
    await next();
    const body = ctx.body;
    if (!body) {
      ctx.body = {
        code: 200,
        data: null,
        message: 'no response',
      };
      return;
    }
    if (body.selfFile) {
      ctx.body = body.data;
      return;
    }
    ctx.body = body.self ? {
      code: 200,
      message: 'success',
      ...(delete body.self && body),
    } : {
      code: 200,
      data: body,
      message: 'success',
    };
  };
};
