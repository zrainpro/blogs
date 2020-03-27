import Vue from 'vue'

// 全局状态与全局状态监听 START
const globalCallback = {};
const globalCallbackBind = {};
const globalGetDataPromise = {};
Vue.prototype.$global = new Proxy({}, {
  get (target, p, receiver) {
    // console.log(target, p, receiver);
    return Reflect.get(target, p, receiver);
  },
  set (target, p, value, receiver) {
    // console.log(target, p, value, receiver, this);
    globalCallback[p] && globalCallback[p].call(globalCallbackBind[p], target[p], value);
    if (globalGetDataPromise[p]) {
      globalGetDataPromise[p].call(null, value);
      delete globalGetDataPromise[p];
    }
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
// 获取真实有效的值,直到有值时调用
Vue.prototype.$getStore = function(name) {
  return new Promise(resolve => {
    if (Vue.prototype.$global[name]) {
      resolve(Vue.prototype.$global[name])
    } else {
      setTimeout(resolve, 1000); // 1s 的超时时长
      globalGetDataPromise[name] = resolve;
    }
  })
}
Vue.prototype.$storeData = function (name, val, { bind, handler } = {}) {
  Vue.prototype.$global[name] = val;
  window.$global = Vue.prototype.$global;
  handler && (globalCallback[name] = handler);
  bind && (globalCallbackBind[name] = bind);
}
// 全局状态与全局状态监听 END

// event bus 部分 START
const eventComponentMethod = {};
const globalSafeEmitPromise = {};
Vue.prototype.$onComponentMethod = function (methodName, { immediate = false, params, handler } = {}) {
  eventComponentMethod[methodName] = {
    callback: handler
  }
  immediate && Vue.prototype.$emitComponentMethod(methodName, params);
  // 安全触发
  if (globalSafeEmitPromise[methodName]) {
    Vue.prototype.$emitComponentMethod(methodName, globalSafeEmitPromise[methodName].val);
    delete globalSafeEmitPromise[methodName];
  }
}
Vue.prototype.$emitComponentMethod = function (methodName, val) {
  if (eventComponentMethod[methodName]) {
    eventComponentMethod[methodName].callback.call(null, val);
  } else {
    // console.error('未知事件')
  }
}
Vue.prototype.$safeEmitComponentMethod = function (methodName, val) {
  if (eventComponentMethod[methodName]) {
    eventComponentMethod[methodName].callback.call(null, val);
  } else {
    globalSafeEmitPromise[methodName] = { val };
  }
}
// event bus 部分 END

// 解析 menu 菜单Id
Vue.prototype.$parseRouter = function () {
  return new Promise(resolve => {
    Vue.prototype.$getStore('menu').then(menu => {
      // 首页没有分类 ID
      if (location.pathname === '/') {
        resolve(null);
      } else {
        const ewaytekMenu = menu.reduce((a, b) => {
          if (b.children) {
            return [...a, b, ...b.children]
          } else {
            return [...a, b]
          }
        }, []);
        resolve(ewaytekMenu.find(it => it.route === location.pathname.replace('/category/', '/')));
      }
    })
  });
}
