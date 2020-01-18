<template>
  <div id="app">
    <transition>
      <router-view />
    </transition>
  </div>
</template>

<script>

export default {
  name: 'app',
  data() {
    return {
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
}
</style>
