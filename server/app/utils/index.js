'use strict';

const counter = require('./counter'); // 计数器
const checked = require('./checked'); // 校验
const eventBus = require('./eventBus'); // 事件桥
const dataDetail = require('./dataDetail'); // 数据处理

module.exports = {
  ...counter,
  ...checked,
  ...eventBus,
  ...dataDetail,
};
