import xss from 'xss'

export default {
  install: Vue => {
    Object.defineProperty(Vue.prototype, '$xss', {
      value: xss
    })
  }
}
