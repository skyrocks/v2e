import Vue from 'vue'

import 'normalize.css/normalize.css'

import 'element-ui/lib/theme-chalk/index.css'
import ElementUI from 'element-ui'

import '@/styles/variables.scss'
import '@/styles/index.scss'
import '@/utils/const'
import '@/components/SvgIcon'
import '@/router/guard'
import '@/directives/func-permission'
import '@/decorator/log'

import App from './App'
import store from './store'
import router from './router'

Vue.use(ElementUI)

Vue.config.productionTip = false

const vue = new Vue({
  el: '#app',
  router,
  store,
  render: h => h(App)
})

// 导出vue, 可以在js导入使用, 如: @/decorator/log
export default vue
