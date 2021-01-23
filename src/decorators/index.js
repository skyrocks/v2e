Function.prototype.before = function(beforeFn) {
  const _self = this
  return function() {
    beforeFn.apply(this, arguments)
    return _self.apply(this, arguments)
  }
}

Function.prototype.after = function(afterFn) {
  const _self = this
  return function() {
    const res = _self.apply(this, arguments)
    afterFn.apply(this, arguments)
    return res
  }
}

Function.prototype.around = function(beforeFn, afterFn) {
  const _self = this
  return function() {
    beforeFn.apply(this, arguments)
    const res = _self.apply(this, arguments)
    afterFn.apply(this, arguments)
    return res
  }
}

// export const before = function(...args) {
//   return function(target, key, descriptor) {
//     descriptor.value = descriptor.value.before(() => {
//       console.log(args)
//     })
//   }
// }

// export const after = function(...args) {
//   return function(target, key, descriptor) {
//     descriptor.value = descriptor.value.after(() => {
//       console.log(args)
//     })
//   }
// }

// export const around = function(...args) {
//   return function(target, key, descriptor) {
//     descriptor.value = descriptor.value.around(
//       () => {
//         console.log(`before ${args}`)
//       },
//       () => {
//         console.log(`after ${args}`)
//       }
//     )
//   }
// }
