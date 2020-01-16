<template>
  <div class="empty">
    <div :style="`color: ${color}`">{{label}}</div>
  </div>
</template>

<script>
  export default {
    name: 'Empty',
    props: {
      label: {
        type: String,
        default: '这儿好像没东西...'
      }
    },
    data() {
      return {
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
    }
  }
</script>

<style lang="less" scoped>
.empty {
  width: 100%;
  height: 340px;
  background-image: url("../assets/empty.png");
  background-repeat: no-repeat;
  background-position: center 40px;
  display: flex;
  justify-content: center;
  align-items: flex-end;
  >div {
    font-size: 16px;
  }
}
</style>
