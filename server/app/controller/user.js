'use strict';

const Controller = require('egg').Controller;
const {
  checkEmpty,
  checkExist,
  checkSave,
} = require('../utils');

class UserController extends Controller {
  // constructor(props) {
  //   super(props);
  //   // const params = ctx.query; // url
  //   // const params = ctx.request.body // post
  // }
  // 登录
  async login() {
    const { ctx } = this;
    const params = ctx.request.body;
    // 检查传参
    const checkEmptyKeys = [
      { key: 'user', message: '用户名不能为空' },
      { key: 'password', message: '密码不能为空' },
    ];
    checkEmpty(checkEmptyKeys, params, ctx);
    // 搜索用户
    const user = await ctx.model.User.findOne({
      user: params.user,
    }).select('user password avatar nickname email phone');
    if (!user || !user._id) {
      ctx.throw('用户不存在,请确认后重试!');
    } else if (user.password !== params.password) {
      ctx.throw('密码错误,请确认后重试!');
    }
    // 设置 session
    ctx.session.user = JSON.stringify({
      id: user._id,
      user: user.user,
      password: user.password,
      time: new Date().getTime(),
    });
    ctx.body = {
      user: user.user,
      avatar: user.avatar,
      nickname: user.nickname,
      email: user.email,
      phone: user.phone,
    };
  }
  // 登出
  async loginout() {
    const { ctx } = this;
    ctx.session.user = null;
    ctx.body = 'ok';
  }
  // 修改用户信息 (需要追加校验)
  async updateUserInfo() {
    const { ctx } = this;
    const params = ctx.request.body;
    // 检查传参
    const checkEmptyKeys = [
      { key: 'user', message: '用户名不能为空' },
    ];
    checkEmpty(checkEmptyKeys, params, ctx);

    const result = await ctx.model.User.findOneAndUpdate({
      user: params.user,
    }, {
      $set: { ...params },
    }).select('user avatar nickname email phone');
    if (!result || !result._id) {
      ctx.throw('无法保存用户信息或者用户不存在');
    }
    ctx.body = result;
  }
  // 注册
  async register() {
    const { ctx } = this;
    const params = ctx.request.body;
    // 检查输入字段
    const checkEmptyKeys = [
      { key: 'user', message: '用户名不能为空' },
      { key: 'password', message: '密码不能为空' },
      { key: 'email', message: '电子邮件不能为空' },
    ];
    checkEmpty(checkEmptyKeys, params, ctx);
    // 判断是否存在
    const checkExistKeys = [
      { key: 'user', value: params.user, message: `用户 “${params.user}” 已存在` },
    ];
    await checkExist(checkExistKeys, ctx, ctx.model.User);
    // 存储用户信息
    const result = await ctx.model.User.create({
      user: params.user,
      password: params.password,
      avatar: params.avatar,
      nickname: params.nickname || params.user,
      email: params.email,
      phone: params.phone,
    });
    // 检查是否保存成功
    await checkSave(result, ctx);
    ctx.body = 'success';
  }
}

module.exports = UserController;
