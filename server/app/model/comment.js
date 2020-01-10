'use strict';
// 评论表
module.exports = app => {
  const mongoose = app.mongoose;
  const Schema = mongoose.Schema;
  const conn = app.mongooseDB.get('zr_blog');
  const counterSchema = new Schema({
    article: { type: String }, // 所属文章ID
    nickname: { type: String }, // 昵称
    avatar: { type: String }, // 头像
    email: { type: String }, // 电子邮箱
    content: { type: String }, // 评论内容
    pid: { type: String }, // 父评论ID, null 表示对文章的评论
    updateTime: { type: Number }, // 更新时间
    createTime: { type: Number }, // 创建时间
  });
  return conn.model('_comment', counterSchema, '_comment');
};
