'use strict';

const Controller = require('egg').Controller;

module.exports = class Proxy extends Controller {
  async index() {
    const { ctx } = this;
    const params = ctx.request.body;
    console.log(params);
    if (!params.url) {
      ctx.body = '';
      return;
    }
    const result = await ctx.curl(params.url || '');
    console.log(result);
    ctx.body = {
      selfFile: true,
      data: result.data,
    };
  }
};
