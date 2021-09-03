<template>
  <div id="app">
    <router-view v-slot="{ Component }">
      <transition>
        <component :is="Component"></component>
      </transition>
    </router-view>
  </div>
</template>

<script>

export default {
  name: 'app',
  data() {
    return {
    }
  },
  created() {
    this.apiGet('/api/needinit').then(res => {
      if (res.code === 200 && res.data) {
        this.$router.replace('/init'); // 跳转到初始化页面
      }
    })
  }
}
</script>

<style lang="less">
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
}
</style>
