/* * 事件代理
 * 通过把事件代理到 document 上, 统一代理,减少事件监听, 优化系统性能
 * 捕获与监听应该注册两个监听事件
 * 不支持 vue react 这类的组件, 这类组件应该由组件自带的 添加事件
 * */

class ProxyEvent {
  constructor (props = {}) {
    this.listener = {};
    this.els = [];
    this.elsType = new Map();
    this.defaultEl = props.el || window;
  }

  // 注册事件
  on(type, callback, options = { el: this.defaultEl, type: true }) {
    // 判断 type 是不是 Boolean 类型的
    if (typeof options.type !== 'boolean') throw new Error('参数 options.type 应该是 布尔值');
    // 先看传的 el 是否是 dom 元素
    if (options.el instanceof Element || options.el === window) {
      // 先看当前元素是否注册过事件
      if (this.els.includes(options.el)) {
        const _ = this.elsType.get(options.el)
        _[String(options.type) + 'Callbacks'].push(callback);
        // 当前元素注册过事件之后判断当前元素的类型(捕获或者冒泡)是否注册过事件
        if (!_[String(options.type) + 'Type']) {
          _[String(options.type) + 'Type'] = true;
          options.el.addEventListener(type, _[String(options.type) + 'Emit'], options.type)
        }
      } else {
        this.els.push(options.el);
        const val = {
          [String(options.type) + 'Type']: true,
          [String(!options.type) + 'Type']: false,
          [String(options.type) + 'Callbacks']: [callback],
          [String(!options.type) + 'Callbacks']: []
        }
        val.trueEmit = function (event) {
          this.trueCallbacks.forEach(func => {
            func.call(event.target, event);
          })
        }.bind(val);
        val.falseEmit = function (event) {
          this.falseCallbacks.forEach(func => {
            func.call(event.target, event);
          })
        }.bind(val);
        this.elsType.set(options.el, val);
        // 没有包含则注册事件
        options.el.addEventListener(type, val[String(options.type) + 'Emit'], options.type)
      }
    } else {
      throw new Error('传入的元素不是正确的 dom 元素!')
    }
  }

  // 移除事件监听
  remove(type, callback, el = this.defaultEl) {
    const _ = this.elsType.get(el);
    if (_) {
      let temp = _.trueCallbacks.findIndex(it => it === callback);
      temp > -1 && (_.trueCallbacks.splice(temp, 1));
      temp = _.falseCallbacks.findIndex(it => it === callback);
      temp > -1 && (_.falseCallbacks.splice(temp, 1));
      // 如果 没有回调数据了 应该清除数据
      if (!_.trueCallbacks.length) {
        _.trueType = false;
        el.removeEventListener(type, _.trueEmit)
      }
      if (!_.falseCallbacks.length) {
        _.falseType = false;
        el.removeEventListener(type, _.falseEmit);
      }
      // 全部没有了, 清除对象数据
      if (!_.trueCallbacks.length && !_.falseCallbacks.length) {
        this.els.splice(this.els.findIndex(it => it === el), 1);
        this.elsType.delete(el);
      }
    }
  }
}

export default {
  install: function (app) {
    app.config.globalProperties.$event = new ProxyEvent();
  }
};
