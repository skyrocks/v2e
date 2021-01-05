/*
 * @Author: shilei
 * @Date: 2020-08-23 15:12:05
 * @LastEditors: shilei
 * @LastEditTime: 2020-10-27 15:44:05
 * @Description: 这是一个什么文件...
 * @FilePath: /aolong-parrot/src/decorator/log.js
 */
import '.'
import main from '@/main'
import { create } from '@/api/log'

/**
 * 日志, 注册成windows全局函数
 * @param {*} method
 * @param {*} route
 */
window.__log = function(method) {
  return function(target, key, descriptor) {
    descriptor.value = descriptor.value.after(() => {
      create({ method, route: main.$route.path, menu: main.$route.meta.title, logType: '2' }) // logType=2 方法类日志
    })
  }
}
