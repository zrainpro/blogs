'use strict';
// 文章表
module.exports = app => {
  const mongoose = app.mongoose;
  const Schema = mongoose.Schema;
  const conn = app.mongooseDB.get('zr_blog');
  const counterSchema = new Schema({
    title: { type: String }, // 文章标题
    topicImg: { type: String }, // 文章主题图片
    intro: { type: String }, // 文章简介, 默认提取内容纯文字前 100 字
    tag: { type: String }, // 文章所属标签
    content: { type: String }, // 文章内容
    category: { type: String }, // 文章分类, 所属目录
    view: { type: Number }, // 阅读量
    updateTime: { type: Number }, // 更新时间
    createTime: { type: Number }, // 创建时间
  });
  return conn.model('_article', counterSchema, '_article');
};
