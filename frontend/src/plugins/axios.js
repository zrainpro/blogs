'use strict';
import axios from 'axios';
import { ElMessage } from 'element-plus';

// Full config:  https://github.com/axios/axios#request-config
// axios.defaults.baseURL = process.env.baseURL || process.env.apiUrl || '';
// axios.defaults.headers.common['Authorization'] = AUTH_TOKEN;
// axios.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded';

const config = {
  // baseURL: process.env.baseURL || process.env.apiUrl || ""
  // timeout: 60 * 1000, // Timeout
  // withCredentials: true, // Check cross-site Access-Control
};

const _axios = axios.create(config);

const Axios = {
  install: function(app) {
    _axios.interceptors.request.use(
      function(config) {
        // Do something before request is sent
        return config;
      },
      function(error) {
        // Do something with request error
        app.config.globalProperties.$global.loading && (app.config.globalProperties.$global.loading = false)
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
            window.localStorage.removeItem('dXNlcg==');
            ElMessage.error('尚未登录');
            window.location.href = '/login';
          }
          app.config.globalProperties.$global.loading && (app.config.globalProperties.$global.loading = false)
          ElMessage.error(data.message || '网络错误')
        }
        return response.data;
      },
      function(error) {
        // Do something with response error
        const data = error.response.data;
        app.config.globalProperties.$global.loading && (app.config.globalProperties.$global.loading = false)
        ElMessage.error(data.message || '网络错误')
        return Promise.reject(error);
      }
    );

    app.axios = _axios;
    app.config.globalProperties.axios = _axios
    window.axios = _axios;
    Object.defineProperties(app.config.globalProperties, {
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
          return _axios.get;
        }
      },
      apiPost: {
        get () {
          return _axios.post;
        }
      },
      apiDelete: {
        get () {
          return _axios.delete;
        }
      }
    });
  }
}

export default Axios;
