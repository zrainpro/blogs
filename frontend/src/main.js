import Vue from 'vue'
import './plugins/axios'
import App from './App.vue'
import './registerServiceWorker'
import router from './router'
import store from './store'
import './style/init.less'
import './plugins/element.js'
import './plugins/storeData.js'
import Icon from './components/Icon';

Vue.component('icon', Icon);

Vue.config.productionTip = false

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
