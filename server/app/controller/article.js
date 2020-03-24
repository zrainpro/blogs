'use strict';

const Controller = require('egg').Controller;
const {
  checkEmpty,
  sliceText,
} = require('../utils');

class UserController extends Controller {
  constructor(props) {
    super(props);
    this.selectKeys = 'title topicImg intro tag content category like dislike view updateTime createTime';
  }
  // 新建/修改 文章
  async patchArticle() {
    const { ctx } = this;
    const params = ctx.request.body;
    // 校验传参
    const checkEmptyKeys = [
      { key: 'title', message: '文章标题不能为空' },
      { key: 'content', message: '文章内容不能为空' },
      { key: 'category', message: '文章分类不能为空' },
    ];
    checkEmpty(checkEmptyKeys, params, ctx);
    // 保存文章
    const saveParams = {
      title: params.title,
      topicImg: params.topicImg,
      intro: params.intro || sliceText(params.content, 100),
      tag: params.tag,
      content: params.content,
      preserve: params.content,
      disabled: 0,
      category: params.category,
      updateTime: new Date().getTime(),
      createTime: new Date().getTime(),
    };
    if (params.id) {
      // 修改文章
      const result = await ctx.model.Article.findOneAndUpdate({
        _id: params.id,
      }, { $set: { ...saveParams } });
      ctx.body = result;
    } else {
      // 新建文章
      const result = await ctx.model.Article.create(saveParams);
      ctx.body = result;
    }
  }
  // 暂存文章
  async keepArticle() {
    const { ctx } = this;
    const params = ctx.request.body;
    // 保存文章
    const saveParams = {
      title: params.title,
      topicImg: params.topicImg,
      tag: params.tag,
      preserve: params.preserve,
      category: params.category,
    };
    if (params.id) {
      // 修改文章
      const result = await ctx.model.Article.findOneAndUpdate({
        _id: params.id,
      }, { $set: { ...saveParams } });
      ctx.body = result;
    } else {
      // 新建文章
      const result = await ctx.model.Article.create({ ...saveParams, disabled: 1 });
      ctx.body = result;
    }
  }
  // 获取文章详情
  async getDetail() {
    const { ctx } = this;
    const articleId = ctx.params.id;
    const result = await ctx.model.Article.findOneAndUpdate({
      _id: articleId,
    }, { $inc: { view: 1 } }).select(this.selectKeys);
    if (!result) {
      ctx.throw('文章不存在');
    }
    ctx.body = result;
  }
  // 后台获取文章详情
  async getBackDetail() {
    const { ctx } = this;
    const articleId = ctx.params.id;
    const result = await ctx.model.Article.findOne({
      _id: articleId,
    }).select(this.selectKeys + ' preserve');
    if (!result) {
      ctx.throw('文章不存在');
    }
    ctx.body = result;
  }
  // 获取所有文章
  async getListAll() {
    await this.getList(false);
  }
  // 获取文章点赞点踩数
  async getLike() {
    const { ctx } = this;
    const articleId = ctx.params.id;
    const result = await ctx.model.Article.findOne({
      _id: articleId,
    }).select('like dislike title view');
    if (!result) {
      ctx.throw('文章不存在');
    }
    ctx.body = result;
  }
  // 获取文章列表
  async getList(viewer) {
    const { ctx } = this;
    const params = { ...ctx.query, ...ctx.request.body };
    const page = parseInt(params.page) || 1;
    const limit = parseInt(params.limit) || 10;
    const disab = parseInt(params.disabled) || 2;
    let skipNum = (page - 1) * limit;
    skipNum < 0 && (skipNum = 0);
    const disabled = viewer ? { disabled: 0 } : (disab === 2 ? {} : { disabled: disab });
    const find = { ...disabled };
    // 获取分类数据
    const category = await ctx.model.Category.find({ ...disabled });
    // 分类查询
    if (params.category) {
      find.category = {
        $in: category.filter(item => String(item._id) === params.category || String(item.pid) === params.category).map(item => item._id),
      };
    }
    // 关键字搜索
    if (params.keyword) {
      find.$or = [
        { title: { $regex: params.keyword } },
        { content: { $regex: params.keyword } },
      ];
    }
    // 标签搜索
    if (params.tag) {
      find.tag = new RegExp(params.tag, 'i');
    }
    const result = await ctx.model.Article.find(find)
      .sort({ updateTime: -1 })
      .skip(skipNum)
      .limit(limit)
      .select(this.selectKeys.replace('content', '') + ' disabled');
    const total = await ctx.model.Article.find(find).count();
    ctx.body = {
      self: true,
      data: JSON.parse(JSON.stringify(result)).map(item => ({
        ...item,
        category: category.find(it => String(it._id) === String(item.category)),
      })),
      page,
      limit,
      total,
    };
  }
  // 点赞文章
  async likeArticle() {
    const { ctx } = this;
    const id = ctx.params.id;
    const ip = ctx.request.ip;
    const params = ctx.request.body;
    if (!id) {
      ctx.throw('文章不存在');
    }
    const likeFilter = {
      article: id,
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
      await ctx.model.Article.update({
        _id: id,
      }, { $inc: { like: 1 } });
    } else if (like.like === 1) {
      ctx.body = { self: true, code: 405, message: '您已经点过赞了哦' };
      return;
    } else if (like.like === 0) {
      await ctx.model.LikeDislike.update(likeFilter, { like: 1 }); // 修改点踩为点赞
      // 增加点赞数同时减少点踩数
      await ctx.model.Article.update({
        _id: id,
      }, { $inc: { like: 1, dislike: -1 } });
    }
    ctx.body = 'success';
  }
  // 点踩文章
  async dislikeArticle() {
    const { ctx } = this;
    const id = ctx.params.id;
    const ip = ctx.request.ip;
    const params = ctx.request.body;
    if (!id) {
      ctx.throw('文章不存在');
    }
    const likeFilter = {
      article: id,
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
      await ctx.model.Article.update({
        _id: id,
      }, { $inc: { like: 0 } });
    } else if (like.like === 0) {
      ctx.body = { self: true, code: 405, message: '您已经点过踩了哦' };
      return;
    } else if (like.like === 1) {
      await ctx.model.LikeDislike.update(likeFilter, { like: 0 }); // 修改点赞为点踩
      // 增加点踩数同时减少点赞数
      await ctx.model.Article.update({
        _id: id,
      }, { $inc: { like: -1, dislike: 1 } });
    }
    ctx.body = 'success';
  }
  // 启用/禁用 文章
  async disabledArticle() {
    const { ctx } = this;
    const id = ctx.params.id;
    if (!id) {
      ctx.throw('文章不存在');
    }
    const params = ctx.request.body;
    const result = await ctx.model.Article.update({
      _id: id,
    }, { disabled: params.disabled });
    ctx.body = result;
  }
  // 删除文章
  async deleteArticle() {
    const { ctx } = this;
    const params = ctx.request.body;
    await ctx.model.Article.remove({
      _id: { $in: params },
    });
    // 同时删除相关评论
    await ctx.model.Comment.remove({
      article: { $in: params },
    });
    ctx.body = 'success';
  }
}

module.exports = UserController;
