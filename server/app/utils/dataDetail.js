'use strict';
const lodash = require('lodash');

// 创建树形数据
function createTreeData(result, pid = 'pid', childKey = 'children', pidValue = null) {
  if (!result) return [];
  const response = result.filter(item => (!pidValue ? (!item[pid] && typeof item[pid] !== 'number') : (String(item[pid]) === pidValue.toString())));
  return response.map(item => {
    const children = createTreeData(result, pid, childKey, item._id);
    return children.length ? {
      ...(JSON.parse(JSON.stringify(item))),
      [childKey]: children,
    } : item;
  });
}
// 从树形数据还原到一维数据
function recoverTreeData(source = [], pidKey = 'pid', idKey = '_id', childKey = 'children', pid) {
  if (!source) return [];
  const response = [];
  source.forEach(item => {
    if (item[childKey]) {
      const child = recoverTreeData(item.children, pidKey, idKey, childKey, item[idKey]);
      const clone = lodash.cloneDeep(item);
      delete clone[childKey];
      response.push(clone, ...child);
    } else {
      response.push({ ...item, [pidKey]: item[pidKey] || pid });
    }
  });
  return response;
}

// 截取纯文字
function sliceText(text = '', count = 0) {
  // 先得到纯文本, 剔除标签等信息
  const filterText = text.replace(/<[^>]>/g, '').trim();
  return filterText.slice(0, count);
}

module.exports = {
  createTreeData,
  recoverTreeData,
  sliceText,
};
