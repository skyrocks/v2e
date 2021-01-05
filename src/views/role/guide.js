/*
 * @Author: shilei
 * @Date: 2020-10-19 20:57:01
 * @LastEditors: shilei
 * @LastEditTime: 2020-10-26 16:29:53
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
  },
  {
    element: '.delete',
    popover: {
      title: '删除自定义角色',
      description: '删除一个自定义的角色,同时删除该角色下用户归属关系',
      position: 'bottom'
    }
  },
  {
    element: '.userCount',
    popover: {
      title: '该角色所包括的用户的数量',
      description: '点击数字可以打开用户的列表,在列表中进行添加用户和删除用户的操作',
      position: 'left'
    }
  },
  {
    element: '.edit',
    popover: {
      title: '修改角色',
      description: '修改角色的名称和状态',
      position: 'left'
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
