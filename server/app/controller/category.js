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
    const result = await ctx.model.Category.find({
      disabled: 0,
    }).select('name address pid');
    // 树形数据构建与返回
    ctx.body = createTreeData(result, 'pid');
  }
  // 添加/修改分类数据
  async insertCategory() {
    const { ctx } = this;
    const params = ctx.request.body;
    const checkEmptyKeys = [
      { key: 'category', message: '数据不能为空' },
    ];
    checkEmpty(checkEmptyKeys, params, ctx);
    // 还原为一维数据
    const data = recoverTreeData(params.category);
    // 获取所有分类
    const categoryData = (await ctx.model.Category.find({ disabled: 0 })) || [];
    const insertData = data.filter(item => !categoryData.find(it => it.name === item.name && it.address === item.address && it.pid === item.pid)).filter(_ => !_._id);
    // 批量插入新数据
    await ctx.model.Category.insertMany(insertData.map(item => ({
      ...item,
      disabled: 0,
      updateTime: new Date().getTime(),
      createTime: new Date().getTime(),
    })));
    // 修改数据
    const updateData = data.filter(item => categoryData.find(it => (it.name !== item.name || it.address !== item.address) && it.pid === item.pid && item._id)); // 名字或者地址不同但是 pid 相同并且 有 _id
    for (const item of updateData) {
      await ctx.model.Category.update({
        _id: item.id,
      }, { $set: { name: item.name, address: item.address, updateTime: new Date().getTime() } });
    }
    ctx.body = 'success';
  }
}

module.exports = CategoryController;
