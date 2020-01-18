<template>
  <div class="home">
    <div v-if="loading" class="loading">
      <div class="loader JS_on">
        <span class="binary" />
        <span class="binary" />
        <span class="getting-there">喝杯咖啡...</span>
      </div>
    </div>
    <div id="nav" ref="nav">
      <div ref="navBar" class="nav-content">
        <div id="logo" ref="logo" @click="$route.path !== '/home' && $router.push('/home')" />
        <SelfNav :menu="menu" :styles="styles" />
      </div>
      <WaveWall :styles="styles" />
    </div>
    <div id="content">
      <transition>
        <router-view />
      </transition>
    </div>
  </div>
</template>

<script>
import SelfNav from '@/components/Nav';
import WaveWall from '@/components/WaveWall';
import moment from 'moment';
import ContextMenu from '../utils/ContextMenu'
import ColorThief from 'color-thief-browser'

export default {
  name: 'home',
  components: {
    SelfNav,
    WaveWall
  },
  data() {
    return {
      moment,
      menu: [
        { name: '杂文', route: '/essay' },
        { name: '闲谈', route: '/chat' },
        { name: '技术',
          route: '/technology',
          children: [
            { name: 'WEB前端', route: '/technology/front' },
            { name: 'NodeJS', route: '/technology/node' },
            { name: '混合开发/小程序', route: '/technology/micro' },
            { name: '半导体技术', route: '/technology/semiconductor' }
          ]
        },
        { name: '操作系统', route: '/os' },
        { name: '友情链接', route: '/blogroll', disabled: true }
      ],
      styles: { color: [255, 255, 255] }, // 导航条样式
      background: [
        'http://img.zrain.top/img/232535.jpg?x-oss-process=style/webp',
        'http://img.zrain.top/img/13206.jpg?x-oss-process=style/webp',
        'http://img.zrain.top/img/150642rmddwgdde1x0o9az.jpg?x-oss-process=style/webp',
        'http://img.zrain.top/img/216087.jpg?x-oss-process=style/webp',
        'http://img.zrain.top/img/217652.jpg?x-oss-process=style/webp',
        'http://img.zrain.top/img/217922.jpg?x-oss-process=style/webp',
        'http://img.zrain.top/img/231285.jpg?x-oss-process=style/webp',
        'http://img.zrain.top/img/287162.jpg?x-oss-process=style/webp',
        'http://img.zrain.top/img/5040.jpg?x-oss-process=style/webp'
      ],
      backgroundImgColor: [], // 主题色
      which: null, // 当前背景图
      loading: true // 加载中 loading 状态
    }
  },
  mounted () {
    // 获取菜单
    this.getMenu();
    // 设置全局数据 loading
    this.$storeData('loading', true, {
      bind: this,
      handler(old, now) {
        this.loading = now
      }
    })
    // 导航条动画
    document.body.onscroll = () => {
      if (window.pageYOffset > 100) {
        this.$refs.nav.className = 'scroll-height'
      } else {
        this.$refs.nav.className = ''
      }
    }
    // 注册获取背景事件
    this.$onComponentMethod('changeTheme', {
      handler: this.changeTheme.bind(this)
    })
    // 添加右键菜单事件
    this.$nextTick(() => {
      // eslint-disable-next-line no-new
      new ContextMenu({
        el: this.$refs.logo,
        menu: [
          { text: '登录', callback: () => { this.$router.push('/login') } },
          { text: '新页面登录', callback() { window.open('/login') } }
        ]
      })
    })
  },
  methods: {
    // 获取菜单
    getMenu() {
      this.apiGet('/api/category/list').then(res => {
        if (res.code === 200) {
          this.menu = res.data.map(root => {
            const menuItem = { name: root.name, route: `/${root.address}`, id: root._id };
            if (root.children) {
              menuItem.children = root.children.map(child => ({ name: child.name, route: `/${root.address}/${child.address}`, id: child._id }))
            }
            return menuItem;
          });
          this.$storeData('menu', this.menu);
        }
      })
    },
    // 更换背景图与主题色
    changeTheme(url) {
      const length = this.background.length;
      this.which = url || this.background[Math.floor(Math.random() * length)];
      // 动态设置背景图
      this.getBackImg()
      // 背景主题色提取
      this.getThemeColor()
      // 防止加载图片意外没有关闭 loading 动画 10秒超时
      setTimeout(() => {
        this.$global.loading && (this.$global.loading = false);
      }, 10 * 1000)
    },
    // 获取背景图
    getBackImg(base64) {
      this.$refs.nav.setAttribute('style', `background-image: url(${base64})`);
    },
    // 获取主题色
    getThemeColor() {
      fetch(this.which)
      .then(res => res.blob())
      .then(blob => {
        return new Promise((resolve) => {
          let reader = new FileReader();
          reader.readAsDataURL(blob);
          reader.onloadend = () => {
            resolve(reader.result); // 输出DataURL数据
          };
        })
      })
      .then(dataUrl => {
        const color = new ColorThief()
        const img = new Image()
        img.src = dataUrl;
        // 设置背景图
        this.getBackImg(dataUrl);
        img.setAttribute('crossOrigin', 'anonymous');
        img.onload = () => {
          this.backgroundImgColor = color.getPalette(img)
          this.$refs.navBar.setAttribute('style', `background-color: rgba(${this.backgroundImgColor[1].join(',')}, 0.15)`)
          this.styles = {
            color: this.backgroundImgColor[1]
          }
          document.body.setAttribute('style', `background: rgb(${this.styles.color.join(',')})`)
          // 把主题色保存到全局
          this.$storeData('themeColor', this.backgroundImgColor[1])
          // 设置 loading 状态
          this.$global.loading = false;
        }
      })
      .catch(e => {
        console.log(e)
        this.$global.loading = false;
      })
    }
  }
}
</script>

<style lang="less" scoped>
  @import url('../style/var');
  .home {
    .loading {
      position: fixed;
      top: 0;
      left: 0;
      width: 100vw;
      height: 100vh;
      background-color: rgba(45,70,84,0.8);
      z-index: 20002;
      display: flex;
      justify-content: center;
      align-items: center;
      .loader {
        width: 200px;
        height: 170px;
        position: relative;
        &::before, &::after {
          content: "";
          width: 0;
          height: 0;
          position: absolute;
          bottom: 30px;
          left: 20px;
          z-index: 1;
          border-left: 80px solid transparent;
          border-right: 80px solid transparent;
          border-bottom: 30px solid darken(#2D4654, 10%);
          transform: scale(0);
          transition: all 0.2s ease;
        }
        &::after {
          border-right: 15px solid transparent;
          border-bottom: 20px solid darken(#2D4654, 13%);
        }
        .getting-there {
          width: 120%;
          text-align: center;
          position: absolute;
          bottom: 0;
          left: -7%;
          font-family: "Lato";
          font-size: 16px;
          letter-spacing: 2px;
          color: white;
        }
        .binary {
          width: 100%;
          height: 140px;
          display: block;
          color: white;
          position: absolute;
          top: 0;
          left: 45px;
          z-index: 2;
          overflow: hidden;

          &::before, &::after {
            font-family: "Lato";
            font-size: 24px;
            position: absolute;
            top: 0;
            left: 0;
            opacity: 0;
          }

          &:nth-child(1) {
            &::before {
              content: "0";
              animation: a 1.1s linear infinite;
            }
            &::after {
              content: "0";
              animation: b 1.3s linear infinite;
            }
          }
          &:nth-child(2) {
            &::before {
              content: "1";
              animation: c 0.9s linear infinite;
            }
            &::after {
              content: "1";
              animation: d 0.7s linear infinite;
            }
          }
        }
        &.JS_on {
          &::before, &::after {
            transform: scale(1);
          }
        }
      }
      @keyframes a {
        0% {
          transform: translate(30px, 0) rotate(30deg);
          opacity: 0;
        }
        100% {
          transform: translate(30px, 150px) rotate(-50deg);
          opacity: 1;
        }
      }
      @keyframes b {
        0% {
          transform: translate(50px, 0) rotate(-40deg);
          opacity: 0;
        }
        100% {
          transform: translate(40px, 150px) rotate(80deg);
          opacity: 1;
        }
      }
      @keyframes c {
        0% {
          transform: translate(70px, 0) rotate(10deg);
          opacity: 0;
        }
        100% {
          transform: translate(60px, 150px) rotate(70deg);
          opacity: 1;
        }
      }
      @keyframes d {
        0% {
          transform: translate(30px, 0) rotate(-50deg);
          opacity: 0;
        }
        100% {
          transform: translate(45px, 150px) rotate(30deg);
          opacity: 1;
        }
      }
    }
  }
  #nav {
    height: 550px;
    background: center center/cover no-repeat currentColor;
    .nav-content {
      padding: 0 40px;
      height: 80px;
      width: 100%;
      position: fixed;
      top: 0;
      left: 0;
      z-index: 1999;
      background-color: transparent;
      backdrop-filter: blur(8px);
      display: flex;
      justify-content: space-between;
      align-items: center;
      transition: all 0.5s ease-in-out;
    }
    #logo {
      display: inline-block;
      position: relative;
      width: 70px;
      height: 70px;
      cursor: pointer;
      background-image: url("../assets/logo.png");
      background-size: cover;
      transition: all 0.5s ease-in-out;
    }
  }
  .scroll-height {
    .nav-content {
      height: 60px !important;
      background-color: rgba(255, 255, 255, 0.5);
    }
    #logo {
      width: 45px !important;
      height: 45px !important;
    }
  }
  #content {
    min-height: calc(100vh - 400px);
    padding-bottom: 100px;
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
    align-items: center;
  }
</style>
