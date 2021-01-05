/*
 * @Author: shilei
 * @Date: 2020-10-19 20:57:01
 * @LastEditors: shilei
 * @LastEditTime: 2020-10-26 16:50:44
 * @Description: 角色管理帮助
 * @FilePath: /aolong-parrot/src/views/auth/guide.js
 */
import { gridSteps } from '@/components/Grid/guide'
const steps = [
  {
    element: '.role-grid',
    popover: {
      title: '选择一个需要授权的角色',
      description: '',
      position: 'left'
    }
  },
  {
    element: '.role-title',
    popover: {
      title: '在此处显示当前选中的需要授权的角色名称',
      description: '',
      position: 'bottom'
    }
  },
  {
    element: '.menu-tree',
    popover: {
      title: '授权菜单及功能',
      description: '授权上级菜单时,系统默认将其所有下级及功能项都会级联授权',
      position: 'right'
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
