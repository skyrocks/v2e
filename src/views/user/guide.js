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
