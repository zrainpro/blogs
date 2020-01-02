import Vue from 'vue'

Vue.prototype.global = {}
Vue.prototype.onComponentMethod = function (methodName, callback) {
  !Vue.prototype.eventComponentMethod && (Vue.prototype.eventComponentMethod = {})
  Vue.prototype.eventComponentMethod[methodName] = {
    callback
  }
}
Vue.prototype.watchStore = function (name, callback) {

}
Vue.prototype.storeData = function (name, val) {
  if (!Vue.prototype.global) Vue.prototype.global = {}
  Vue.prototype.global[name] = val
  // 更新 data 应该触发 vue 的重渲染
  // this.$forceUpdate()
}
Vue.prototype.emitComponentMethod = function (methodName, val) {
  !Vue.prototype.eventComponentMethod && (Vue.prototype.eventComponentMethod = {})
  if (Vue.prototype.eventComponentMethod[methodName]) {
    Vue.prototype.eventComponentMethod[methodName].callback(val)
  } else {
    // console.error('未知事件')
  }
}
