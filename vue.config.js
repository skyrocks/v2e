// console.log('project: ' + process.env.VUE_APP_PROJECT)

const timestamp = new Date().getTime()
// const CopyWebpackPlugin = require('copy-webpack-plugin')

module.exports = {
  publicPath: process.env.VUE_APP_URL, // 公共路径
  outputDir: process.env.VUE_APP_DIR, // 不同的环境打不同包名
  lintOnSave: true,
  productionSourceMap: process.env.NODE_ENV === 'production' ? false : true, // 生产环境下打包不产生map文件
  assetsDir: 'static',
  css: {
    sourceMap: process.env.NODE_ENV === 'production' ? false : true, // 生产环境下打包不产生map文件
    loaderOptions: {
      sass: {
        prependData: `@import "@/assets/style/variables.scss";@import "@/assets/style/global.scss";`
      }
    }
  },

  chainWebpack: config => {
    config.module
      .rule('images')
      .test(/\.(jpg|png|gif|jpeg)$/)
      .use('url-loader')
      .loader('url-loader')
      .tap(options => {
        //将图片文件名的hash方式改成时间戳, 这样在CopyWebpackPlugin中替换不同项目图片时可以直接覆盖
        options.fallback.options.name = `static/img/[name].${timestamp}.[ext]`
        return options
      })
      .end()
  },

  //webpack配置
  configureWebpack: {
    // plugins: [
    //   new CopyWebpackPlugin([
    //     {
    //       from: `project/${process.env.VUE_APP_PROJECT}/assets/img`,
    //       to: `static/img/[name].${timestamp}.[ext]`,
    //       force: true
    //     }
    //   ])
    // ],

    //关闭 webpack 的性能提示
    performance: {
      hints: false
    }
    //或者
    //警告 webpack 的性能提示
    // performance: {
    //   hints:'warning',
    //   //入口起点的最大体积
    //   maxEntrypointSize: 50000000,
    //   //生成文件的最大体积
    //   maxAssetSize: 30000000,
    //   //只给出 js 文件的性能提示
    //   assetFilter: function(assetFilename) {
    //     return assetFilename.endsWith('.js');
    //   }
    // }
  },

  // 开发环境配置代理服务，实现跨域
  devServer: {
    port: 8080,
    open: false,
    https: false,
    proxy: {
      '/api': {
        target: process.env.VUE_APP_BASE_API,
        changeOrigin: true,
        pathRewrite: {
          '^/api': ''
        }
      }
    }
  }
}
