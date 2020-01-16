<template>
  <div ref="menu" class="nav-menu">
    <div ref="bar" class="nvm-menu-bar" />
    <div v-for="(item, index) in menu" :key="item.name" class="nav-menu-item" @mouseenter="mouseenter(item, index)" @mouseleave="mouseleave">
      <router-link :to="`/category${item.route}`">{{item.name}}</router-link>
      <div v-if="item.children && showDrop === item.name" ref="menuDrop" class="nav-menu-drop">
        <div v-for="it in item.children" :key="it.name" class="nav-menu-drop-item">
          <router-link :to="`/category${it.route}`">{{it.name}}</router-link>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  export default {
    props: {
      menu: {
        type: Array,
        default() { return [] }
      },
      styles: {
        type: Object,
        default() { return {} }
      }
    },
    name: 'm-nav',
    data() {
      return {
        showDrop: null,
        barStyle: {
          left: 0,
          opacity: 0
        }
      }
    },
    mounted () {
      this.$nextTick(this.setStyle)
    },
    watch: {
      styles: {
        deep: true,
        handler() {
          this.setStyle()
        }
      }
    },
    methods: {
      // 设置主题色
      setStyle() {
        if (this.styles.color) {
          if (this.styles.color.reduce((a, b) => a + b, 0) < 180) {
            this.$refs.menu && this.$refs.menu.setAttribute('style', `color: rgb(244,244,244)`);
          }
        }
      },
      // 设置menu样式
      setBarStyle() {
        this.$refs.bar.setAttribute('style', Object.keys(this.barStyle).map(key => `${key}: ${this.barStyle[key]}`).join(';'))
      },
      mouseenter(item, index) {
        this.showDrop = item.name;
        this.barStyle.left = index * 100 + 'px';
        this.barStyle.opacity = 1;
        this.setBarStyle();
      },
      mouseleave() {
        this.showDrop = null;
        this.barStyle.opacity = 0;
        this.setBarStyle();
      }
    }
  }
</script>

<style lang="less">
  @import url(../style/var);
  .nav-menu {
    display: flex;
    flex-direction: row;
    justify-content: center;
    align-items: center;
    height: 100%;
    position: relative;
  }
  .nvm-menu-bar {
    width: 100px;
    height: 3px;
    border-radius: 6px;
    box-shadow: 0 3px 4px rgba(22, 160, 133, 0.6);
    background: linear-gradient(#16A085 30%, @link 70%);
    position: absolute;
    left: 0;
    top: 85%;
    opacity: 0;
    transition: all cubic-bezier(.3,1.5,.5,1) .7s;
  }
  .nav-menu-item {
    width: 100px;
    height: 100%;
    position: relative;
    cursor: pointer;
    >a {
      font-size: 16px;
      font-weight: bold;
      display: flex;
      justify-content: center;
      align-items: center;
      width: 100%;
      height: 100%;
    }
  }
  .nav-menu-drop {
    position: absolute;
    top: 86%;
    left: 0;
    padding: 5px 0;
    background-color: rgba(0,0,0, .5);
    backdrop-filter: blur(8px);
    border-radius: 5px;
    box-shadow: @box-shadow;
    &:before {
      content: '';
      display: block;
      border-left: 8px solid transparent;
      border-right: 8px solid transparent;
      border-bottom: 8px solid rgba(0,0,0, .5);
      position: absolute;
      top: -8px;
      left: 44px;
    }
  }
  .nav-menu-drop-item {
    display: block;
    padding: 8px 12px;
    font-size: 14px;
    color: #eee;
    &:hover {
      background-color: rgba(255, 255, 255, 0.5);
      color: #eee;
    }
    a {
      &:hover {
        color: inherit;
      }
    }
    >* {
      display: block;
      width: max-content;
    }
  }
</style>
