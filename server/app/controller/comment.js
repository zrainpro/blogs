'use strict';

const Controller = require('egg').Controller;
const {
  checkEmpty,
  checkSave,
} = require('../utils');
// todo 防止重复点赞
class UserController extends Controller {
  // 后台获取评论列表
  async getCommentsAll() {
    const { ctx } = this;
    const params = ctx.request.body;
    const find = {};
    if (params.article) {
      find.article = params.article;
    }
    if (typeof params.disabled !== 'undefined' && params.disabled !== 2) {
      find.disabled = parseInt(params.disabled);
    }
    if (params.keyword) {
      find.$where = `this.content.includes(${params.keyword})`;
    }
    const page = params.page || 1;
    const limit = params.limit || 10;
    let skipNum = (page - 1) * limit;
    skipNum < 0 && (skipNum = 0);
    // 评论内容
    const result = await ctx.model.Comment.find(find)
      .sort({ updateTime: -1 })
      .skip(skipNum)
      .limit(limit);
    const total = await ctx.model.Comment.find(find).count(); // 总数
    // 文章信息
    const article = await ctx.model.Article.find({
      _id: { $in: result.map(_ => _.article) },
    });
    // 获取用户信息
    let users = await ctx.model.CommentUser.find({
      _id: { $in: result.map(item => item.user) },
    });
    users = JSON.parse(JSON.stringify(users));
    ctx.body = {
      self: true,
      data: result.map(_ => ({
        ...(users.find(it => String(_.user) === it._id) || {}),
        ..._._doc,
        article: article.find(__ => String(_.article) === String(__._id)),
      })),
      page,
      limit,
      total,
    };
  }
  // 获取文章的评论列表
  async getComments() {
    const { ctx } = this;
    const params = ctx.query;
    const selectKeys = 'article user content like dislike pid rootPid updateTime createTime';
    const limit = parseInt(params.limit) || 5; // 默认取5条数据
    let skipNum = ((parseInt(params.page) || 1) - 1) * limit; // 从多少条开始获取数据, 用于分页
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
    // 获取所有子评论
    const childResult = await ctx.model.Comment.find({
      article: articleId,
      rootPid: { $in: response.map(item => item._id) },
      disabled: 0,
    }).sort({ updateTime: -1 }).select(selectKeys);
    const childResponse = JSON.parse(JSON.stringify(childResult || [])); // 转化为 json 对象
    // 获取用户信息
    let users = await ctx.model.CommentUser.find({
      _id: { $in: [ ...response, ...childResponse ].map(item => item.user) },
    });
    users = JSON.parse(JSON.stringify(users));
    // 统一追加 用户信息
    childResponse.forEach(item => {
      const tempUser = JSON.parse(JSON.stringify(users.find(it => it._id === item.user) || {}));
      delete tempUser._id;
      Object.assign(item, tempUser); // 把用户数据合并到返回信息中
    });
    for (const item of response) {
      // 整合用户信息
      const tempUser = JSON.parse(JSON.stringify(users.find(it => it._id === item.user) || {}));
      delete tempUser._id;
      Object.assign(item, tempUser); // 把用户数据合并到返回信息中
      // 获取根评论的子评论
      // 获取回复评论的父评论信息 同时过滤 pid 不存在的
      item.children = childResponse.filter(it => it.rootPid === item._id).map(it => {
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
    // 查找创建用户
    const user = await ctx.model.CommentUser.findOneAndUpdate({
      email: params.email,
    }, {
      email: params.email,
      nickname: params.nickname,
      avatar: params.avatar,
      blog: params.blog,
    }, { new: true, upsert: true });
    // 保存
    const result = await ctx.model.Comment.create({
      article: params.article,
      user: user._id,
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
    const { ctx } = this;
    const id = ctx.params.id;
    const ip = ctx.request.ip;
    const params = ctx.request.body;
    if (!id) {
      ctx.throw('评论不存在');
    }
    const likeFilter = {
      comment: id,
    };
    if (params.email) {
      likeFilter.user = params.email;
    } else {
      likeFilter.ip = ip;
    }
    // 查找点赞点踩表,防止重复点赞,防止点赞同时点踩
    const like = await ctx.model.LikeDislike.findOne(likeFilter);
    if (!like) {
      await ctx.model.LikeDislike.create({ ...likeFilter, like: 1 }); // 记录点赞信息
      // 增加点赞数
      await ctx.model.Comment.update({
        _id: id,
      }, { $inc: { like: 1 } });
    } else if (like.like === 1) {
      ctx.body = { self: true, code: 405, message: '您已经点过赞了哦' };
      return;
    } else if (like.like === 0) {
      await ctx.model.LikeDislike.update(likeFilter, { like: 1 }); // 修改点踩为点赞
      // 增加点赞数同时减少点踩数
      await ctx.model.Comment.update({
        _id: id,
      }, { $inc: { like: 1, dislike: -1 } });
    }
    ctx.body = 'success';
  }
  // 点踩评论
  async dislikeComment() {
    const { ctx } = this;
    const id = ctx.params.id;
    const ip = ctx.request.ip;
    const params = ctx.request.body;
    if (!id) {
      ctx.throw('评论不存在');
    }
    const likeFilter = {
      comment: id,
    };
    if (params.email) {
      likeFilter.user = params.email;
    } else {
      likeFilter.ip = ip;
    }
    // 查找点赞点踩表,防止重复点赞,防止点赞同时点踩
    const like = await ctx.model.LikeDislike.findOne(likeFilter);
    if (!like) {
      await ctx.model.LikeDislike.create({ ...likeFilter, like: 0 }); // 记录点踩信息
      // 增加点踩数
      await ctx.model.Comment.update({
        _id: id,
      }, { $inc: { like: 0 } });
    } else if (like.like === 0) {
      ctx.body = { self: true, code: 405, message: '您已经点过踩了哦' };
      return;
    } else if (like.like === 1) {
      await ctx.model.LikeDislike.update(likeFilter, { like: 0 }); // 修改点赞为点踩
      // 增加点踩数同时减少点赞数
      await ctx.model.Comment.update({
        _id: id,
      }, { $inc: { like: -1, dislike: 1 } });
    }
    ctx.body = 'success';
  }
  // 批量启用 / 禁用评论
  async enabledComment() {
    const { ctx } = this;
    const params = ctx.request.body;
    const comments = params.comments;
    const code = params.code === 0 ? 0 : 1;
    const result = await ctx.model.Comment.update({
      $or: [
        { _id: { $in: comments } },
        { rootPid: { $in: comments } },
      ],
    }, { disabled: code });
    ctx.body = result;
  }
  // 批量删除评论
  async deleteComment() {
    const { ctx } = this;
    const params = ctx.request.body;
    ctx.body = await ctx.model.Comment.remove({
      $or: [
        { _id: { $in: params } },
        { rootPid: { $in: params } },
      ],
    });
  }
}

module.exports = UserController;
