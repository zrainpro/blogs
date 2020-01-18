'use strict';

const Controller = require('egg').Controller;
const {
  checkEmpty,
  checkSave,
} = require('../utils');

class UserController extends Controller {
  // 获取文章的评论列表
  async getComments() {
    const { ctx } = this;
    const params = ctx.query;
    const selectKeys = 'article nickname avatar email blog content like dislike pid updateTime createTime';
    const limit = params.limit || 10; // 默认取10条数据
    let skipNum = ((params.page || 1) - 1) * limit; // 从多少条开始获取数据, 用于分页
    skipNum < 0 && (skipNum = 0); // 不能为负数
    const articleId = ctx.params.id;
    if (!articleId) {
      ctx.throw('未知的文章');
    }
    const filterKeys = {
      article: articleId,
      rootPid: null,
      pid: null,
      disabled: 0,
    }; // 筛选条件
    const result = await ctx.model.Comment.find(filterKeys)
      .sort({ updateTime: -1 }) // 按照更细时间降序排列
      .skip(skipNum) // 分页
      .limit(limit) // 请求数据条数
      .select(selectKeys);
    // 如果没有找到数据, 直接返回空数组
    if (!result) {
      ctx.body = [];
      return;
    }
    const response = JSON.parse(JSON.stringify(result));
    // 获取根评论的子评论
    for (const item of response) {
      const childResult = await ctx.model.Comment.find({
        article: articleId,
        rootPid: item._id,
        disabled: 0,
      }).sort({ updateTime: -1 }).select(selectKeys);
      // 获取回复评论的父评论信息 同时过滤 pid 不存在的
      const childResponse = JSON.parse(JSON.stringify(childResult || []));
      item.children = childResponse.map(it => {
        const pidInfo = childResponse.find(_ => String(_._id) === String(it.pid));
        return { ...it, pidInfo };
      });
    }
    // 获取评论总条数
    const total = await ctx.model.Comment.find(filterKeys).count('_id');
    ctx.body = {
      self: true,
      data: response,
      page: params.page || 1,
      limit,
      total,
    };
  }
  // 添加评论
  async addComment() {
    const { ctx } = this;
    const params = ctx.request.body;
    // 检查传参
    const checkEmptyKeys = [
      { key: 'article', message: '文章ID不能为空' },
      { key: 'nickname', message: '昵称不能为空' },
      { key: 'email', message: '电子邮箱不能为空' },
      { key: 'content', message: '评论内容不能为空' },
    ];
    checkEmpty(checkEmptyKeys, params, ctx);
    // 校验文章是否存在
    const articleInfo = await ctx.model.Article.findOne({ _id: params.article });
    if (!articleInfo) {
      ctx.throw('文章不存在');
    }
    // 保存
    const result = await ctx.model.Comment.create({
      article: params.article,
      nickname: params.nickname,
      avatar: params.avatar,
      email: params.email,
      blog: params.blog,
      content: params.content,
      pid: params.pid,
      rootPid: params.rootPid,
      disabled: 0,
      updateTime: new Date().getTime(),
      createTime: new Date().getTime(),
    });
    checkSave(result, ctx, '评论失败,请重试!');
    ctx.body = result;
  }
  // 点赞评论
  async likeComment() {
    // todo 防止重复点赞
    const { ctx } = this;
    const id = ctx.params.id;
    const params = ctx.request.body;
    if (!id) {
      ctx.throw('评论不存在');
    }
    const result = await ctx.model.Comment.update({
      _id: id,
    }, { $inc: { like: params.off ? -1 : 1 } });
    ctx.body = result;
  }
  // 点踩评论
  async dislikeComment() {
    const { ctx } = this;
    const id = ctx.params.id;
    if (!id) {
      ctx.throw('评论不存在');
    }
    const params = ctx.request.body;
    const result = await ctx.model.Comment.update({
      _id: id,
    }, { $inc: { dislike: params.off ? -1 : 1 } });
    ctx.body = result;
  }
}

module.exports = UserController;
