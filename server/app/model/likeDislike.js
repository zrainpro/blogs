'use strict';
// 点赞点踩表
module.exports = app => {
  const mongoose = app.mongoose;
  const Schema = mongoose.Schema;
  const conn = app.mongooseDB.get('zr_blog');
  const counterSchema = new Schema({
    article: { type: String }, // 所属文章ID
    user: { type: String }, // 所属用户 ID
    comment: { type: String }, // 所属评论 ID
    ip: { type: String }, // 请求者 ip 用于没有填写邮箱的
    like: { type: Number, default: 1 }, // 点赞 1, 点踩 0
    updateTime: { type: Number }, // 更新时间
    createTime: { type: Number }, // 创建时间
  });
  return conn.model('_likeDislike', counterSchema, '_likeDislike');
};
