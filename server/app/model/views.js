'use strict';
// 浏览人数表
module.exports = app => {
  const mongoose = app.mongoose;
  const Schema = mongoose.Schema;
  const conn = app.mongooseDB.get('zr_blog');
  const counterSchema = new Schema({
    article: { type: String }, // 所属文章ID
    ip: { type: String }, // 浏览人的 ip
    city: { type: String }, // 冗余一下城市信息避免查询太多
    createTime: { type: Number }, // 创建时间
  });
  return conn.model('_views', counterSchema, '_views');
};
