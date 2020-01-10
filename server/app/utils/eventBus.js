'use strict';

// 全局事件通讯系统
const eventBus = {};
function eventOn(name, callback, context = null) {
  if (!eventBus[name]) {
    eventBus[name] = { context, callback };
  }
}
function eventEmit(name, ...params) {
  if (eventBus[name]) {
    const temp = eventBus[name];
    temp.callback.call(temp.context, ...params);
  }
}
function eventOff(name) {
  if (eventBus[name]) {
    delete eventBus[name];
  }
}

module.exports = {
  eventOn,
  eventEmit,
  eventOff,
};
