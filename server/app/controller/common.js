'use strict';

const Controller = require('egg').Controller;

module.exports = class Proxy extends Controller {
  async patch() {
    const { ctx } = this;
    const params = ctx.request.body;
    if (!params.key) {
      ctx.throw('请输入字段信息');
    }
    if (!params.value) {
      ctx.throw('请输入要保存的值');
    }
    await ctx.model.Common.findOneAndUpdate({
      key: params.key,
    }, { value: JSON.stringify(params.value) }, { new: true, upsert: true });
    ctx.body = 'success';
  }
  async get() {
    const { ctx } = this;
    const params = ctx.query;
    const result = await ctx.model.Common.findOne({ key: params.key }) || {};
    ctx.body = JSON.parse(result.value || '[]');
  }
  async some2() {
    const { ctx } = this;
    console.log('comming in');
    ctx.body = {
      data: 'ok',
    };
  }
  async some() {
    const { ctx } = this;
    const { router, controller } = process.selfData;
    const params = ctx.query;
    router[params.method || 'get']('/' + params.url, controller.common.some2);
    ctx.body = {
      data: 'hello word',
    };
  }
};
