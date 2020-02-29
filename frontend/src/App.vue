<template>
  <div id="app">
    <transition>
      <router-view />
    </transition>
    <div id="asd"></div>
  </div>
</template>

<script>

export default {
  name: 'app',
  data() {
    return {
    }
  },
  mounted() {
    console.log(document.getElementById('content'))
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
