'use strict';
// 用户表
module.exports = app => {
  const mongoose = app.mongoose;
  const Schema = mongoose.Schema;
  const conn = app.mongooseDB.get('zr_blog');
  const counterSchema = new Schema({
    user: { type: String }, // 用户名
    password: { type: String }, // 密码
    avatar: { type: String }, // 头像
    nickname: { type: String }, // 昵称
    email: { type: String }, // 电子邮箱
    phone: { type: String }, // 电话
  });
  return conn.model('_user', counterSchema, '_user');
};
