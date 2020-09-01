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

export default {
  install: Vue => {
    Vue.directive('has', {
      inserted: function(el, binding, vNode) {
        const characteristic = binding.value
        if (characteristic) {
          const key = characteristic
          const funcKeys = vNode.context.$route.meta.funcKeys
          if (funcKeys instanceof Array && funcKeys.indexOf(key) < 0) {
            el.parentNode.removeChild(el)
          }
        }
      }
    })
  }
}
