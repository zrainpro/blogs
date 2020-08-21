export default class ContextMenu {
  constructor (props) {
    this.menu = props.menu || [];
    this.el = props.el;
    this.x = 0;
    this.y = 0;
    this.id = new Date().getTime() + '_' + Math.random();
    this.box = null;
    this.unRenderFunc = null;
    this.register();
  }

  // 注册事件
  register() {
    if (!this.el || !(this.el instanceof Element)) {
      console.error('传入参数: "el" 不是dom节点')
      return
    }
    const a = document.createElement('div')
    // 兼容不支持 contextmenu 事件
    if ('oncontextmenu' in a) {
      this.el.addEventListener('contextmenu', (event) => {
        event.stopPropagation();
        event.preventDefault();
        if (event.target !== this.el) return false
        this.x = event.offsetX;
        this.y = event.offsetY;
        this.render();
      }, true)
    } else {
      this.el.addEventListener('mousedown', event => {
        if (event.which === 3) {
          event.preventDefault();
          event.stopPropagation();
          // 禁止右键菜单
          this.el.oncontextmenu = () => false;
          this.x = event.offsetX;
          this.y = event.offsetY;
          this.render();
        }
      }, true)
    }
  }

  // 创建样式
  createStyle() {
    if (document.head.querySelector('style[data="zr-contextmenu"]')) return
    const styleStr = `.zr-contextmenu {
  position: absolute;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: flex-start;
  padding: 5px;
  background-color: rgba(0,0,0, 0.5);
  backdrop-filter: blur(8px);
  box-shadow: 0 13px 15px rgba(31,45,61,.15);
  border-radius: 4px;
}
.zr-contextmenu-item {
  width: 100%;
  padding: 8px 30px;
  cursor: pointer;
}
.zr-contextmenu-item:hover {
  background-color: rgba(255,255,255,0.5);
}
.zr-contextmenu-item > * {
  width: max-content;
  color: #FFF;
  font-size: 14px;
}`;
    const style = document.createElement('style');
    style.type = 'text/css';
    style.setAttribute('data', 'zr-contextmenu');
    style.innerText = styleStr;
    document.head.appendChild(style)
  }

  // 获取事件的 path 路径
  getEventPath(event) {
    if (!event) return [];
    if (event.target.parentNode) {
      return [event.target, ...this.getEventPath({ target: event.target.parentNode })];
    } else {
      return [event.target, document.body];
    }
  }

  // 隐藏菜单取消注册事件
  unRender(event) {
    let unregister = true;
    try {
      // 兼容不同浏览器获取事件的 node 路径
      const path = this.getEventPath(event);
      // 如果是触发元素右键则不取消注册
      if (event && event.target === this.el && event.which !== 3) {
        unregister = false;
      }
      // 如果是菜单, 同样不取消注册
      if (path.includes(this.box)) {
        unregister = false;
      }
    } catch (e) {
      console.log(e);
    }
    if (unregister) {
      this.el.removeChild(this.box);
      document.removeEventListener('mousedown', this.unRenderFunc);
    }
  }

  // 渲染菜单
  render() {
    if (!this.menu || !this.menu.length) return;
    this.createStyle(); // 写入样式
    this.unRenderFunc = this.unRender.bind(this); // 绑定隐藏函数
    this.box = document.createElement('div');
    this.box.className = 'zr-contextmenu';
    this.box.setAttribute('style', `left: ${this.x}px; top: ${this.y}px`)
    this.menu.forEach((item, index) => {
      const itemDom = document.createElement('div');
      itemDom.className = 'zr-contextmenu-item';
      itemDom.innerHTML = '<div>' + item.text + '</div>';
      itemDom.onclick = (event) => {
        event.stopPropagation();
        item.callback && item.callback.call(null, event, itemDom, index);
        setTimeout(this.unRenderFunc, 100)
      };
      this.box.appendChild(itemDom);
    })
    this.el.appendChild(this.box);
    // 添加隐藏弹窗事件(添加延迟防止渲染的时候直接触发隐藏)
    setTimeout(() => {
      document.addEventListener('mousedown', this.unRenderFunc);
    }, 20)
  }
}
