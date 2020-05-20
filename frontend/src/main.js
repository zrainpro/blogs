import Vue from 'vue';
import './plugins/axios';
import App from './App.vue';
import './registerServiceWorker';
import router from './router';
import store from './store';
import './style/init.less';
import './plugins/element.js';
import './plugins/storeData.js';
import './plugins/dom.js';
import './plugins/proxyEvent';
import Icon from './components/Icon';
import moment from 'moment';

window.moment = moment; // 在 window 下挂载 moment 函数

Vue.component('icon', Icon);

Vue.config.productionTip = false

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
