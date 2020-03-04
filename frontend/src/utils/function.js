// 触发浏览器事件
export function dispatchEvent(event) {
  if (Event.prototype.initEvent) {
    const evt = window.document.createEvent('UIEvents');
    evt.initUIEvent(event, true, false, window, 0);
    window.dispatchEvent(evt);
  } else {
    window.dispatchEvent(new Event(event));
  }
}
// 深层解析所需数据, 结构数据格式: { 需求的键名: 实际的键名 }
export function parseData(dataSource = [], structure = {}, children = 'children') {
  const response = [];
  dataSource.forEach(item => {
    const temp = {};
    Object.entries(structure).forEach(([need, real]) => {
      temp[need] = item[real];
    });
    if (item[children]) {
      temp[children] = parseData(item[children], structure, children);
    }
    response.push(temp);
  })
  return response;
}
