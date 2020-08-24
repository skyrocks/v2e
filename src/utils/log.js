import { create } from '@/api/log'

Function.prototype.before = function(beforeFn) {
  let _self = this
  return function() {
    beforeFn.apply(this, arguments)
    return _self.apply(this, arguments)
  }
}

Function.prototype.after = function(afterFn) {
  let _self = this
  return function() {
    const res = _self.apply(this, arguments)
    afterFn.apply(this, arguments)
    return res
  }
}

Function.prototype.around = function(beforeFn, afterFn) {
  let _self = this
  return function() {
    beforeFn.apply(this, arguments)
    const res = _self.apply(this, arguments)
    afterFn.apply(this, arguments)
    return res
  }
}

export const before = function(...args) {
  return function(target, key, descriptor) {
    descriptor.value = descriptor.value.before(() => {
      console.log(args)
    })
  }
}

export const after = function(...args) {
  return function(target, key, descriptor) {
    descriptor.value = descriptor.value.after(() => {
      console.log(args)
    })
  }
}

export const around = function(...args) {
  return function(target, key, descriptor) {
    descriptor.value = descriptor.value.around(
      () => {
        console.log(`before ${args}`)
      },
      () => {
        console.log(`after ${args}`)
      }
    )
  }
}

/**
 * 日志
 * @param {*} method
 * @param {*} route
 */
export const log = function(method) {
  return function(target, key, descriptor) {
    descriptor.value = descriptor.value.after(() => {
      create({ method, route: window.__V.route.path, menu: window.__V.route.meta.title, logType: '2' })
    })
  }
}
