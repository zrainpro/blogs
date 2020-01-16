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
  }
}
