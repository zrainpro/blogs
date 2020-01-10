'use strict';

// 搜索不到结果返回友好的值
function responseFriendly(result, value, ctx) {
  if (!result) {
    ctx.body = value;
    return true;
  }
}

module.exports = {
  responseFriendly,
};
