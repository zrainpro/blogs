'use strict';
const lodash = require('lodash');

// 为空校验
function checkEmpty(keys = [], params = {}, ctx) {
  keys.forEach(({ key, message }) => {
    if (lodash.isEmpty(params[key])) {
      ctx.throw(message);
    }
  });
}
// 已存在校验
async function checkExist(keys = [], ctx, db) {
  for (const item of keys) {
    const found = await db.findOne({
      [item.key]: item.value,
    });
    if (found && found._id) {
      ctx.throw(item.message);
    }
  }
}
// 检查是否创建成功
async function checkSave(result, ctx, message) {
  if (!result._id) {
    ctx.throw(message || '创建失败,请重新提交!');
  }
}
// 搜索不到结果返回友好的值
function responseFriendly(result, value, ctx) {
  if (!result) {
    ctx.body = value;
    return true;
  }
}

module.exports = {
  checkEmpty,
  checkExist,
  checkSave,
  responseFriendly
};
