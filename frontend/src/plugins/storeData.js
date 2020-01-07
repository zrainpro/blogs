import Vue from 'vue'

// 全局状态与全局状态监听 START
const globalCallback = {};
const globalCallbackBind = {};
Vue.prototype.$global = new Proxy({}, {
  get (target, p, receiver) {
    // console.log(target, p, receiver);
    return Reflect.get(target, p, receiver);
  },
  set (target, p, value, receiver) {
    // console.log(target, p, value, receiver, this);
    globalCallback[p] && globalCallback[p].call(globalCallbackBind[p], target[p], value);
    // 更改值之后触发重新渲染(真正改变才触发)
    target[p] !== value && Vue.prototype.$forceUpdate()
    return Reflect.set(target, p, value, receiver);
  }
})
Vue.prototype.$watchStore = function (name, { handler }) {
  if (Vue.prototype.$global[name]) {
    globalCallback[name] = handler
  }
}
Vue.prototype.$storeData = function (name, val, { bind, handler }) {
  Vue.prototype.$global[name] = val;
  window.$global = Vue.prototype.$global;
  handler && (globalCallback[name] = handler);
  bind && (globalCallbackBind[name] = bind);
}
// 全局状态与全局状态监听 END

// event bus 部分 START
Vue.prototype.$eventComponentMethod = {}
Vue.prototype.$onComponentMethod = function (methodName, callback) {
  !Vue.prototype.$eventComponentMethod && (Vue.prototype.$eventComponentMethod = {})
  Vue.prototype.$eventComponentMethod[methodName] = {
    callback
  }
}
Vue.prototype.$emitComponentMethod = function (methodName, val) {
  !Vue.prototype.$eventComponentMethod && (Vue.prototype.$eventComponentMethod = {})
  if (Vue.prototype.$eventComponentMethod[methodName]) {
    Vue.prototype.$eventComponentMethod[methodName].callback.call(null, val);
  } else {
    // console.error('未知事件')
  }
}
// event bus 部分 END
