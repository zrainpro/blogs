'use strict';
// 评论用户表
module.exports = app => {
  const mongoose = app.mongoose;
  const Schema = mongoose.Schema;
  const conn = app.mongooseDB.get('zr_blog');
  const counterSchema = new Schema({
    nickname: { type: String }, // 昵称
    avatar: { type: String }, // 头像
    email: { type: String }, // 电子邮箱
    blog: { type: String }, // 个人博客地址
    updateTime: { type: Number }, // 更新时间
    createTime: { type: Number }, // 创建时间
  });
  return conn.model('_commentUser', counterSchema, '_commentUser');
};
