/*
 * @Author: shilei
 * @Date: 2020-10-19 20:57:01
 * @LastEditors: shilei
 * @LastEditTime: 2020-10-19 20:59:36
 * @Description: 角色管理帮助
 * @FilePath: /aolong-parrot/src/views/role/guide.js
 */
import { gridSteps } from '@/components/Grid/guide'
const steps = [
  {
    element: '.add',
    popover: {
      title: '添加自定义角色',
      description: '添加一个自定义的角色',
      position: 'bottom'
    }
  }
]

const mixin = {
  data() {
    return {
      steps,
      gridSteps
    }
  }
}
export { mixin as guide }
