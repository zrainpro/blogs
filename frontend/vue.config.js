const MonacoWebpackPlugin = require('monaco-editor-webpack-plugin');
const zlib = require('zlib');

module.exports = {
  devServer: {
    proxy: {
      '/api': {
        // target: 'http://[::1]:7001',
        target: 'http://zrain.top',
        changeOrigin: true,
        pathRewrite: {
          '^/api/': '/'
        }
      }
    }
  },

  pluginOptions: {
    compression:{
      brotli: {
        filename: '[file].br[query]',
        algorithm: 'brotliCompress',
        include: /\.(js|css|html|svg|json)(\?.*)?$/i,
        compressionOptions: {
          params: {
            [zlib.constants.BROTLI_PARAM_QUALITY]: 11,
          },
        },
        minRatio: 0.8
      },
      gzip: {
        filename: '[file].gz[query]',
        algorithm: 'gzip',
        exclude: 'index.html',
        include: /\.(js|css|html|svg|json)(\?.*)?$/i,
        minRatio: 0.8,
        deleteOriginalAssets: false
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
  },

  productionSourceMap: false
}
