'use strict';
// 分类目录表
module.exports = app => {
  const mongoose = app.mongoose;
  const Schema = mongoose.Schema;
  const conn = app.mongooseDB.get('zr_blog');
  const commonSchema = new Schema({
    key: { type: String }, // 字段名
    value: { type: String }, // 值
    updateTime: { type: Number }, // 更新时间
    createTime: { type: Number }, // 创建时间
  });
  return conn.model('_common', commonSchema, '_common');
};
