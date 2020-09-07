'use strict';
const pathToRegexp = require('path-to-regexp');

// 接口缓存配置, 单位 秒
const config = [
  { path: '/statistics/time', time: 1 },
  { path: '/statistics/address', time: 1 },
];

const data = {}; // 缓存的数据

module.exports = () => {
  return async function redis(ctx, next) {
    const redisWhich = config.find(item => pathToRegexp.pathToRegexp(item.path).exec(ctx.path));
    if (redisWhich) {
      // 获取缓存的参数, 以参数为缓存依据
      const params = JSON.stringify(ctx.request.body || {});
      const which = ctx.path + params;
      // 判断是否有缓存数据, 并判断是否缓存过期
      if (data[which] && new Date().getTime() - data[which].time < redisWhich.time * 1000) {
        ctx.body = data[which].data;
      } else {
        await next();
        // 把最新的数据缓存
        data[which] = { data: ctx.body, time: new Date().getTime() };
      }
    } else {
      await next();
    }
  };
};
