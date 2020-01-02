<template>
  <div id="app">
    <div id="nav" ref="nav">
      <div ref="navBar" class="nav-content">
        <div id="logo" ref="logo" @click="$router.push('/')" />
        <SelfNav :menu="menu" :styles="styles" />
      </div>
      <WaveWall :styles="styles" />
    </div>
    <div id="content">
      <router-view />
    </div>
  </div>
</template>

<script>
import SelfNav from '@/components/Nav';
import WaveWall from '@/components/WaveWall';
import ColorThief from 'color-thief-browser';
import ContextMenu from './utils/ContextMenu'; // 右键菜单

export default {
  components: {
    SelfNav,
    WaveWall
  },
  name: 'app',
  data() {
    return {
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
      styles: {}, // 导航条样式
      background: [
        'https://img.zrain.top/img/232535.jpg?x-oss-process=style/webp',
        'https://img.zrain.top/img/13206.jpg?x-oss-process=style/webp',
        'https://img.zrain.top/img/150642rmddwgdde1x0o9az.jpg?x-oss-process=style/webp',
        'https://img.zrain.top/img/216087.jpg?x-oss-process=style/webp',
        'https://img.zrain.top/img/217652.jpg?x-oss-process=style/webp',
        'https://img.zrain.top/img/217922.jpg?x-oss-process=style/webp',
        'https://img.zrain.top/img/231285.jpg?x-oss-process=style/webp',
        'https://img.zrain.top/img/287162.jpg?x-oss-process=style/webp',
        'https://img.zrain.top/img/5040.jpg?x-oss-process=style/webp'
      ],
      backgroundImgColor: [], // 主题色
      which: null // 当前背景图
    }
  },
  mounted () {
    // 导航条动画
    document.body.onscroll = () => {
      if (window.pageYOffset > 100) {
        this.$refs.nav.className = 'scroll-height'
      } else {
        this.$refs.nav.className = ''
      }
    }
    // 动态设置背景图
    this.getBackImg()
    // 背景主题色提取
    this.getThemeColor()
    // 添加右键菜单事件
    this.$nextTick(() => {
      // eslint-disable-next-line no-new
      new ContextMenu({
        el: this.$refs.logo,
        menu: [
          { text: '登录', callback() { console.log(222) } },
          { text: '新页面登录', callback() { console.log(33333) } }
        ]
      })
    })
  },
  methods: {
    // 获取背景图
    getBackImg() {
      const length = this.background.length;
      this.which = this.background[Math.floor(Math.random() * length)];
      this.$refs.nav.setAttribute('style', `background-image: url(${this.which})`);
    },
    // 获取主题色
    getThemeColor() {
      // 先请求来图片在转为 base64 格式, 避免跨域
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
        img.onload = () => {
          this.backgroundImgColor = color.getPalette(img)
          this.$refs.navBar.setAttribute('style', `background-color: rgba(${this.backgroundImgColor[1].join(',')}, 0.15)`)
          this.styles = {
            color: this.backgroundImgColor[1]
          }
          document.body.setAttribute('style', `background: rgb(${this.styles.color.join(',')})`)
        }
      })
    }
  }
}
</script>

<style lang="less">
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}
#nav {
  height: 550px;
  background-color: currentColor;
  background: center center/cover no-repeat;
  .nav-content {
    padding: 0 40px;
    height: 80px;
    width: 100%;
    position: fixed;
    top: 0;
    left: 0;
    z-index: 1000;
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
    background-image: url("./assets/logo.png");
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
  min-height: calc(100vh - 80px);
  height: 1000px;
}
</style>
