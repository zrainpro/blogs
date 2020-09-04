'use strict';
// ip 信息表
module.exports = app => {
  const mongoose = app.mongoose;
  const Schema = mongoose.Schema;
  const conn = app.mongooseDB.get('zr_blog');
  const counterSchema = new Schema({
    ip: { type: String }, // 浏览人的 ip
    address: { type: String }, // 简要地址信息
    city: { type: String }, // ip 对应城市
    point: { type: String }, // 城市中心点
    addressDetail: { type: String }, // 结构化城市信息, json 数据
  });
  return conn.model('_ip', counterSchema, '_ip');
};
