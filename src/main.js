/*
 * @Author: shilei
 * @Date: 2020-08-22 23:53:00
 * @LastEditors: shilei
 * @LastEditTime: 2020-10-27 15:38:33
 * @Description: 这是一个什么文件...
 * @FilePath: /aolong-parrot/src/main.js
 */
import Vue from 'vue'

import 'normalize.css/normalize.css'

import 'element-ui/lib/theme-chalk/index.css'
import ElementUI from 'element-ui'

import '@/styles/variables.scss'
import '@/styles/index.scss'

import '@/utils/const'
import '@/router/guard'
import '@/decorator/log'
import '@/components/SvgIcon'
import '@/components/Button'
import xss from '@/plugins/xss'

import has from '@/directives/auth'
import waves from '@/directives/waves'

import store from './store'
import router from './router'
import App from './App'

Vue.use(ElementUI)
  .use(has)
  .use(waves)
  .use(xss)

Vue.config.productionTip = false

const vue = new Vue({
  el: '#app',
  router,
  store,
  render: h => h(App)
})

// 导出vue, 可以在js导入使用, 如: @/plugins/request
export default vue
