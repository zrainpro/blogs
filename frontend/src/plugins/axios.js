'use strict';

import Vue from 'vue';
import axios from 'axios';
import Element from 'element-ui';

// Full config:  https://github.com/axios/axios#request-config
// axios.defaults.baseURL = process.env.baseURL || process.env.apiUrl || '';
// axios.defaults.headers.common['Authorization'] = AUTH_TOKEN;
// axios.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded';

let config = {
  // baseURL: process.env.baseURL || process.env.apiUrl || ""
  // timeout: 60 * 1000, // Timeout
  // withCredentials: true, // Check cross-site Access-Control
};

const _axios = axios.create(config);

_axios.interceptors.request.use(
  function(config) {
    // Do something before request is sent
    return config;
  },
  function(error) {
    // Do something with request error
    Vue.prototype.$global.loading && (Vue.prototype.$global.loading = false)
    return Promise.reject(error);
  }
);

// Add a response interceptor
_axios.interceptors.response.use(
  function(response) {
    const data = response.data;
    if (data.code !== 200) {
      // 如果没有登录跳转到登录
      if (data.code === 600) {
        window.sessionStorage.removeItem('user');
        Element.Message.error('尚未登录');
        window.location.href = '/login';
      }
      Vue.prototype.$global.loading && (Vue.prototype.$global.loading = false)
      Element.Message.error(data.message || '网络错误')
    }
    return response.data;
  },
  function(error) {
    // Do something with response error
    const data = error.response.data;
    Vue.prototype.$global.loading && (Vue.prototype.$global.loading = false)
    Element.Message.error(data.message || '网络错误')
    return Promise.reject(error);
  }
);

Plugin.install = function(Vue, options) {
  Vue.axios = _axios;
  window.axios = _axios;
  Object.defineProperties(Vue.prototype, {
    axios: {
      get() {
        return _axios;
      }
    },
    $axios: {
      get() {
        return _axios;
      }
    },
    apiGet: {
      get () {
        return _axios.get
      }
    },
    apiPost: {
      get () {
        return _axios.post
      }
    }
  });
};

Vue.use(Plugin)

export default Plugin;
