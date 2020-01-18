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
  // 获取文章列表
  async getList() {
    const { ctx } = this;
    const params = ctx.query;
    const page = params.page || 1;
    const limit = params.limit || 10;
    let skipNum = (page - 1) * limit;
    skipNum < 0 && (skipNum = 0);
    const find = { disabled: 0 };
    // 分类查询
    if (params.category) {
      const category = await ctx.model.Category.find({ disabled: 0 });
      find.category = {
        $in: category.filter(item => String(item._id) === params.category || String(item.pid) === params.category).map(item => item._id),
      };
    }
    // 关键字搜索
    if (params.keyword) {
      find.$where = `this.title.includes(${params.keyword}) || this.content.includes(${params.keyword})`;
    }
    // 标签搜索
    if (params.tag) {
      find.tag = new RegExp(params.tag, 'i');
    }
    const result = await ctx.model.Article.find(find)
      .sort({ updateTime: -1 })
      .skip(skipNum)
      .limit(limit)
      .select(this.selectKeys.replace('content', ''));
    ctx.body = result;
  }
  // 点赞文章
  async likeArticle() {
    const { ctx } = this;
    const id = ctx.params.id;
    if (!id) {
      ctx.throw('文章不存在');
    }
    const params = ctx.request.body;
    const result = await ctx.model.Article.update({
      _id: id,
    }, { $inc: { like: params.off ? -1 : 1 } });
    ctx.body = result;
  }
  // 点踩文章
  async dislikeArticle() {
    const { ctx } = this;
    const id = ctx.params.id;
    if (!id) {
      ctx.throw('文章不存在');
    }
    const params = ctx.request.body;
    const result = await ctx.model.Article.update({
      _id: id,
    }, { $inc: { dislike: params.off ? -1 : 1 } });
    ctx.body = result;
  }
}

module.exports = UserController;
