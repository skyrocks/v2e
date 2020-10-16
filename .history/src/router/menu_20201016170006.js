/*
 * @Author: shilei
 * @Date: 2020-08-17 09:45:42
 * @LastEditors: shilei
 * @LastEditTime: 2020-10-16 16:59:58
 * @Description: 构建动态路由
 * @FilePath: /aolong-parrot/src/router/menu.js
 */
import router from '.'
import staticRoute from './static'
import Layout from '@/layout'
import store from '@/store'

const createDynamicRouter = () => {
  const routers = []
    .concat(staticRoute)
    .concat(createMenuTree(store.getters.menus))
    .concat([{ path: '*', redirect: '/404', hidden: true }]) // * 404  page must be placed at the end !!!

  router.options.routes = router.options.routes.concat(routers)
  router.addRoutes(routers)
  store.dispatch('menu/saveRouters', routers)
}

/**
 * Note: sub-menu only appear when route children.length >= 1
 * Detail see: https://panjiachen.github.io/vue-element-admin-site/guide/essentials/router-and-nav.html
 *
 * hidden: true                   if set true, item will not show in the sidebar(default is false)
 * alwaysShow: true               if set true, will always show the root menu
 *                                if not set alwaysShow, when item has more than one children route,
 *                                it will becomes nested mode, otherwise not show the root menu
 * redirect: noRedirect           if set noRedirect will no redirect in the breadcrumb
 * name:'router-name'             the name is used by <keep-alive> (must set!!!)
 * meta : {
    roles: ['admin','editor']    control the page roles (you can set multiple roles)
    title: 'title'               the name show in sidebar and breadcrumb (recommend set)
    icon: 'svg-name'/'el-icon-x' the icon show in the sidebar
    breadcrumb: false            if set false, the item will hidden in breadcrumb(default is true)
    activeMenu: '/example/list'  if set path, the sidebar will highlight the path you set
  }
 */
const createMenuTree = data => {
  const menus = []
  // 顶级
  data.forEach(ele => {
    if (ele.parentId === '') {
      if (ele.children.length == 0) {
        menus.push({
          path: `/${ele.menuCode}`,
          component: Layout,
          children: [
            {
              path: ele.menuCode,
              name: ele.menuId,
              component: () => Promise.resolve(require(`@/views/${ele.route}/index`).default),
              meta: { title: ele.menuName, icon: ele.iconClass, funcKeys: ele.funcKeys }
            }
          ]
        })
      } else {
        menus.push({
          path: `/${ele.menuCode}`,
          component: Layout,
          name: ele.menuId,
          meta: { title: ele.menuName, icon: ele.iconClass },
          children: createSubMenu(ele.children)
        })
      }
    }
  })
  return menus
}

const createSubMenu = data => {
  const menus = []
  data.forEach(ele => {
    if (ele.children.length === 0) {
      // 末级
      menus.push({
        path: ele.menuCode,
        name: ele.menuId,
        component: () => Promise.resolve(require(`@/views/${ele.route}/index`).default),
        /*
        component: () => resolve => require([`@/views/${ele.route}/index`], resolve),
        component: () => import('@/views/${ele.route}/index')
        以上两种写法都会有问题, 编译的时候就会出现警告
        Critical dependency: the request of a dependency is an expression
        然后在路由请求的时候根本加载不出来,日志也不会报出什么错误
        这个坑很大
        */
        // resolve => require([`@/views/${ele.route}/index`], resolve),
        meta: { title: ele.menuName, funcKeys: ele.funcKeys }
      })
    } else {
      // 非末级
      menus.push({
        path: ele.menuCode,
        name: ele.menuId,
        meta: { title: ele.menuName },
        children: createSubMenu(ele.children)
      })
    }
  })
  return menus
}

export { createDynamicRouter }
