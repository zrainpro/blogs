<template>
  <div class="nav-menu" @click="changeMenu">
    <icon use="icondrxx03" class="nav-bar"></icon>
    <div v-if="showMenu"
         class="nav-menu-box"
         :style="`background-color: rgba(${styles.color.join(',')}, 0.6); top: ${height}px; height: calc(100vh - ${height}px); color: ${color}`">
      <div v-for="(item) in realMenu" :key="item.name" :class="item.children ? '' : 'nav-menu-item'">
        <div v-if="item.children"
             class="nav-menu-item"
             :style="`color: ${item.showChildren ? '#42b983' : ''}`"
             @click.stop="showChildren(item)"
        >{{item.name}}</div>
        <router-link v-else :to="`/category${item.route}`">{{item.name}}</router-link>
        <div v-if="item.children && item.showChildren"
             class="nav-menu-drop"
             :style="`background: rgba(${styles.color.join(',')}, 0.8)`"
        >
          <div v-for="it in item.children" :key="it.name" class="nav-menu-drop-item">
            <router-link :to="`/category${it.route}`">{{it.name}}</router-link>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  export default {
    name: "mobileNav",
    props: {
      menu: {
        type: Array,
        default() { return [] }
      },
      styles: {
        type: Object,
        default() { return { color: [255, 255, 255] } }
      },
      height: {
        type: Number,
        default: 80
      }
    },
    data() {
      return {
        showMenu: true, // 是否展示菜单,
        color: 'rgb(45, 70, 84)',
        reload: Math.random(),
        realMenu: []
      }
    },
    watch: {
      styles: {
        deep: true,
        immediate: true,
        handler() {
          this.setStyle()
        }
      },
      menu: {
        immediate: true,
        handler() {
          this.realMenu = this.menu.map(_ => ({ ..._, showChildren: false }));
        }
      }
    },
    methods: {
      changeMenu() {
        this.showMenu = !this.showMenu;
      },
      showChildren(item) {
        // this.$set(item, 'showChildren', !item.showChildren)
        item.showChildren = !item.showChildren;
        this.reload = Math.random();
      },
      // 设置主题色
      setStyle() {
        if (this.styles.color) {
          if (this.styles.color.reduce((a, b) => a + b, 0) < 380) {
            this.color = 'rgb(232, 248, 245)'
          } else {
            this.color = 'rgb(45, 70, 84)';
          }
        }
      },
    }
  }
</script>

<style lang="less" scoped>
  .nav-menu {
    .nav-bar {
      font-size: 40px;
    }
    .nav-menu-box {
      position: fixed;
      right: 0;
      top: 80px;
      background-color: rgba(0,0,0, 0.9);
      color: #2d4654;
      width: 70vw;
      height: calc(100vh - 80px);
      padding-top: 20px;
      transition: all 0.5s;
    }
    .nav-menu-item {
      height: 40px;
      line-height: 40px;
    }
    .nav-menu-drop {
      padding: 10px 0;
      .nav-menu-drop-item {
        height: 40px;
        line-height: 40px;
      }
    }
  }
</style>
