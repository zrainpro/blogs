'use strict';
// 分类目录表
module.exports = app => {
  const mongoose = app.mongoose;
  const Schema = mongoose.Schema;
  const conn = app.mongooseDB.get('zr_blog');
  const counterSchema = new Schema({
    name: { type: String }, // 分类名
    address: { type: String }, // 对应地址
    disabled: { type: Number }, // 是否启用, 1 禁用 / 0 启用
    pid: { type: Schema.Types.ObjectId }, // 父分类, null 为顶级分类
    updateTime: { type: Number }, // 更新时间
    createTime: { type: Number }, // 创建时间
  });
  return conn.model('_category', counterSchema, '_category');
};
