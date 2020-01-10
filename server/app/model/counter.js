'use strict';

module.exports = app => {
  const mongoose = app.mongoose;
  const Schema = mongoose.Schema;
  const conn = app.mongooseDB.get('zr_blog');
  const counterSchema = new Schema({
    _id: { type: String },
    value: { type: Number },
  });
  return conn.model('_counter', counterSchema, '_counter');
};
