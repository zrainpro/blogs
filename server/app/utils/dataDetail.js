'use strict';
const lodash = require('lodash');

// 创建树形数据
function createTreeData(result, pid, childKey = 'children', pidValue = null) {
  if (!result) return [];
  const response = result.filter(item => (!pidValue ? !item[pid] && typeof item[pid] !== 'number' : item[pid] === pidValue));
  return response.map(item => {
    const children = createTreeData(result, pid, childKey, item._id);
    return children.length ? {
      ...item,
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

module.exports = {
  createTreeData,
  recoverTreeData,
};
