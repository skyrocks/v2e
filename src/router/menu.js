import router from '.'
import { resetRouter } from '@/router'
import Layout from '@/layout'
import store from '@/store'

const createDynamicRouter = () => {
  const menus = createMenuTree(store.getters.menus)
  const dashboard = [
    {
      path: '/',
      component: Layout,
      redirect: '/dashboard',
      children: [
        {
          path: 'dashboard',
          name: 'Dashboard',
          component: () => import('@/views/dashboard/index'),
          meta: { title: 'Dashboard', icon: 'wfapply' }
        }
      ]
    }
  ]
  const r404 = [{ path: '*', redirect: '/404', hidden: true }]

  resetRouter()
  router.options.routes = [].concat(dashboard).concat(menus)
  router.addRoutes(menus)
  router.addRoutes(r404)
}

const createMenuTree = data => {
  let menus = []
  data.forEach(ele => {
    let menu
    if (ele.children == 0) {
      menu = {
        path: ele.menuCode,
        component: Layout,
        children: [
          {
            path: 'index',
            name: ele.menuId,
            component: () => import(`@/views/${ele.component}/index`),
            meta: { title: ele.menuName, icon: ele.parentId === '' ? ele.iconClass : '' }
          }
        ]
      }
    } else {
      menu = {
        path: ele.menuCode,
        component: Layout,
        name: ele.menuId,
        meta: { title: ele.menuName, icon: ele.parentId === '' ? ele.iconClass : '' },
        children: createMenuTree(ele.children)
      }
    }
    menus.push(menu)
  })
  return menus
}

export { createDynamicRouter }
