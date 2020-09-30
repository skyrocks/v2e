const gridSteps = [
  {
    element: '.grid-serach',
    popover: {
      title: '表格搜索',
      description: '下拉选择搜索列, 输入搜索内容, 与表格列头的搜索项互为补充',
      position: 'bottom'
    }
  },
  {
    element: '.el-table__header',
    popover: {
      title: '表格列头',
      description: '列头已锁定, 可以点击列头排序, 搜索',
      position: 'bottom-center'
    }
  },
  {
    element: '.grid-pagination',
    popover: {
      title: '表格分页',
      description: '显示总记录数, 在此可以切换每页显示的记录数, 可以输入任意页码前往跳转',
      position: 'top'
    }
  },
  {
    element: '.gird-bbar .column',
    popover: {
      title: '表格显示列',
      description: '任意勾选列名, 显示或隐藏表格列',
      position: 'top-right'
    }
  },
  {
    element: '.gird-bbar .export',
    popover: {
      title: '表格导出',
      description: '导出当前页的数据, 并保存成Excel格式, 导出列以当前显示列为准',
      position: 'top-right'
    }
  },
  {
    element: '.gird-bbar .clear',
    popover: {
      title: '清除表格搜索和过滤',
      description: '此操作可以清除掉所有的过滤条件并恢复默认的排序状态',
      position: 'top-right'
      // position can be left, left-center, left-bottom,
      // top, top-center, top-right,
      // right, right-center, right-bottom,
      // bottom, bottom-center, bottom-right,
      // mid-center
    }
  }
]

export { gridSteps }
