/*
 * @Author: shilei
 * @Date: 2020-09-28 14:53:46
 * @LastEditors: shilei
 * @LastEditTime: 2020-10-26 16:37:37
 * @Description: 用户管理手册
 * @FilePath: /aolong-parrot/src/views/user/guide.js
 */
import { gridSteps } from '@/components/Grid/guide'
const steps = [
  {
    element: '.enable',
    popover: {
      title: '激活',
      description: '批量勾选记录, 点击此按钮批量激活用户',
      position: 'bottom'
    }
  },
  {
    element: '.disable',
    popover: {
      title: '禁用',
      description: '批量勾选记录, 点击此按钮批量禁用用户',
      position: 'bottom'
    }
  },
  {
    element: '.editPwd',
    popover: {
      title: '修改密码',
      description: '批量勾选记录, 点击此按钮批量修改用户账号密码',
      position: 'bottom'
    }
  },
  {
    element: '.editExpiry',
    popover: {
      title: '修改有效期',
      description: '批量勾选记录, 点击此按钮批量修改用户账号的有效期',
      position: 'bottom'
    }
  },
  {
    element: '.add',
    popover: {
      title: '添加虚拟用户',
      description: '添加一个虚拟账号',
      position: 'bottom'
    }
  },
  {
    element: '.remove',
    popover: {
      title: '删除虚拟用户',
      description: '批量记录, 点击此按钮删除勾选的虚拟用户',
      position: 'bottom'
    }
  },
  {
    element: '.photo',
    popover: {
      title: '用户头像',
      description: '鼠标移动上去,可以更换用户头像',
      position: 'left'
    }
  },
  {
    element: '.role',
    popover: {
      title: '用户所归属的角色',
      description: '当用户归属角色超过1个,仅显示角色数量,鼠标移动上去,可以进行删除归属角色或者添加归属角色',
      position: 'left'
    }
  },
  {
    element: '.edit',
    popover: {
      title: '修改',
      description: '修改用户属性,不同类别的用户能够修改的属性是不一样的',
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
