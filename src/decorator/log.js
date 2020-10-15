import '.'
import _this from '@/main'
import { create } from '@/api/log'

/**
 * 日志, 注册成windows全局函数
 * @param {*} method
 * @param {*} route
 */
window.__log = function(method) {
  return function(target, key, descriptor) {
    descriptor.value = descriptor.value.after(() => {
      create({ method, route: _this.$route.path, menu: _this.$route.meta.title, logType: '2' }) // logType=2 方法类日志
    })
  }
}
