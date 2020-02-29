'use strict';

const Controller = require('egg').Controller;
const {
  checkEmpty,
  createTreeData,
  recoverTreeData,
} = require('../utils');

class CategoryController extends Controller {
  // constructor (props) {
  //   super(props);
  // }
  // 获取分类列表
  async getList() {
    const { ctx } = this;
    const filterKey = { disabled: 0 }; // 默认搜索没禁用的
    const selectKeys = 'name address pid';
    const result = await ctx.model.Category.find(filterKey).select(selectKeys);
    // 树形数据构建与返回
    ctx.body = createTreeData(result, 'pid');
  }
  // 获取全部分类
  async getAllList() {
    const { ctx } = this;
    const selectKeys = 'name address pid disabled';
    const result = await ctx.model.Category.find().select(selectKeys);
    // 树形数据构建与返回
    ctx.body = createTreeData(result, 'pid');
  }
  // 禁用分类 todo 不限制禁用层级
  async enabledCategory() {
    const { ctx } = this;
    const id = ctx.params.id;
    const params = ctx.request.body;
    const result = await ctx.model.Category.update({
      $or: [
        {
          _id: id,
        },
        {
          pid: id,
        },
      ],
    }, { $set: { disabled: params.disabled } });
    ctx.body = result;
  }
  // 添加/修改分类数据
  async insertCategory() {
    const { ctx } = this;
    const params = ctx.request.body;
    const checkEmptyKeys = [
      { key: 'category', message: '分类数据不能为空' },
    ];
    checkEmpty(checkEmptyKeys, params, ctx);
    // 还原为一维数据
    const data = recoverTreeData(params.category);
    // 获取所有分类
    const categoryData = (await ctx.model.Category.find({ disabled: 0 })) || [];
    // 批量插入新数据
    await this.insertNewData(params.category);
    // 修改数据
    const updateData = data.filter(item => categoryData.find(it => String(item._id) === String(it._id) && (it.name !== item.name || it.address !== item.address))); // 名字或者地址不同且 id 相同
    for (const item of updateData) {
      await ctx.model.Category.update({
        _id: item._id,
      }, { $set: { name: item.name, address: item.address, updateTime: new Date().getTime() } });
    }
    ctx.body = 'success';
  }
  // 递归插入新数据
  async insertNewData(category, pid = null) {
    const { ctx } = this;
    // 过滤出新数据
    const news = category.filter(item => !item._id);
    const insertNews = await ctx.model.Category.insertMany(news.map(item => ({
      ...item,
      pid,
      disabled: 0,
      updateTime: new Date().getTime(),
      createTime: new Date().getTime(),
    })));
    // 处理 新数据的 children 级的
    for (let i = 0; i < news.length; i++) {
      // 有children的进入下一级插入
      if (news[i].children) {
        await this.insertNewData(news[i].children, insertNews[i]._id);
      }
    }
    // 处理 非新数据 的 children 级 有新加的数据
    const old = category.filter(item => item._id);
    for (let i = 0; i < old.length; i++) {
      if (old[i].children) {
        await this.insertNewData(old[i].children, old[i]._id);
      }
    }
  }
}

module.exports = CategoryController;
