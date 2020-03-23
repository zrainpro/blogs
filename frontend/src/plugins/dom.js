// 插入元素
window.insertAfter = function (target, element, parents) {
  if (!target) return;
  const parent = target?.parentElement || parents || document.body;
  if (target && target.nextSibling) {
    parent.insertBefore(element, target.nextSibling);
  } else {
    parent.appendChild(element);
  }
}
// 复制
window.copyText = function (text) {
  if (window.copy) {
    return window.copy(text);
  } else {
    const dom = document.createElement('textarea');
    dom.value = text;
    document.body.appendChild(dom);
    dom.select();
    document.execCommand('Copy');
    document.body.removeChild(dom);
  }
}
