/*
 * @Author: shilei
 * @Date: 2020-08-29 10:02:32
 * @LastEditors: shilei
 * @LastEditTime: 2020-10-27 16:11:43
 * @Description: 权限验证装饰器
 * @FilePath: /aolong-parrot/src/directives/auth.js
 */
// import Vue from 'vue'

// const has = Vue.directive('has', {
//   inserted: function(el, binding, vNode) {
//     const characteristic = binding.value
//     if (characteristic) {
//       const key = characteristic
//       const funcKeys = vNode.context.$route.meta.funcKeys
//       if (funcKeys instanceof Array && funcKeys.indexOf(key) < 0) {
//         el.parentNode.removeChild(el)
//       }
//     }
//   }
// })
// export { has }

import Vue from 'vue'
import main from '@/main'

Vue.prototype.$has = function(key) {
  if (key === undefined || key === '') {
    return true
  } else {
    const funcKeys = main.$route.meta.funcKeys
    if (funcKeys instanceof Array && funcKeys.indexOf(key) < 0) {
      return false
    } else {
      return true
    }
  }
}

const checkPermission = function(el, binding, vNode) {
  const characteristic = binding.value
  if (characteristic) {
    const key = characteristic
    const funcKeys = vNode.context.$route.meta.funcKeys
    if (funcKeys instanceof Array && funcKeys.indexOf(key) < 0) {
      el.parentNode.removeChild(el)
    }
  }
}

export default {
  install: Vue => {
    Vue.directive('has', {
      inserted: function(el, binding, vNode) {
        checkPermission(el, binding, vNode)
      },
      update(el, binding, vNode) {
        checkPermission(el, binding, vNode)
      }
    })
  }
}
