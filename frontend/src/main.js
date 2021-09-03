import { createApp } from 'vue';
import App from './App.vue';
import './registerServiceWorker';
import './plugins/dom.js';
import router from './router';
import './style/init.less';
import Element from './plugins/element.js';
import StoreData from './plugins/storeData.js';
import Axios from './plugins/axios';
import ProxyEvent from './plugins/proxyEvent';
import Icon from './components/Icon';
import moment from 'moment';

window.moment = moment; // 在 window 下挂载 moment 函数

createApp(App)
  .component('icon', Icon)
  .use(Element)
  .use(Axios)
  .use(StoreData)
  .use(ProxyEvent)
  .use(router)
  .use({
    install(app) {
      app.instance = app.mount('#app')
    }
  })
