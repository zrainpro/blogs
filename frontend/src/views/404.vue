<template>
  <div :class="`page404 ${which.className}`">
    <h1 :style="`color: ${color}`">{{which.label}}</h1>
  </div>
</template>

<script>
  export default {
    name: 'page404',
    data() {
      return {
        className: [
          { className: 'one404', label: '服务器开小差了, 找不到您请求的网页' },
          { className: 'two404', label: '您访问的页面在一个荒无人烟之地' }
        ],
        which: {},
        color: 'rgba(141, 147, 161, 0.8)'
      }
    },
    mounted () {
      this.$getStore('themeColor').then(color => {
        if (color.reduce((a, b) => a + b, 0) < 180) {
          this.color = 'rgba(236, 240, 241, 0.8)';
        } else {
          this.color = 'rgba(141, 147, 161, 0.8)';
        }
      })
    },
    watch: {
      $route: {
        immediate: true,
        handler() {
          this.which = this.className[Math.floor(Math.random() * this.className.length)]
        }
      }
    }
  }
</script>

<style lang="less">
  .page404 {
    width: 100%;
    height: 480px;
    background-position: top;
    background-repeat: no-repeat;
    display: flex;
    justify-content: center;
    align-items: flex-end;
    h1 {
      font-size: 24px;
    }
  }
  .one404 {
    background-image: url("../assets/4041.png");
    background-size: 600px;
  }
  .two404 {
    background-image: url("../assets/4042.png");
    background-size: 600px;
  }
</style>
