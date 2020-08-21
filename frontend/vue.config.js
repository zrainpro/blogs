const MonacoWebpackPlugin = require('monaco-editor-webpack-plugin');

module.exports = {
  devServer: {
    proxy: {
      '/api': {
        target: 'http://[::1]:7001',
        changeOrigin: true,
        pathRewrite: {
          '^/api/': '/'
        }
      }
    }
  },

  configureWebpack: {
    plugins: [
      new MonacoWebpackPlugin()
    ]
  },

  pwa: {
    name: '雨鱼',
    msTileColor: '#4DBA87',
    manifestOptions: {
      background_color: '#4DBA87'
    }
  }
}
