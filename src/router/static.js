/*
 * @Author: shilei
 * @Date: 2020-10-15 17:14:23
 * @LastEditors: shilei
 * @LastEditTime: 2020-10-16 17:04:47
 * @Description: 静态路由
 * @FilePath: /aolong-parrot/src/router/static.js
 */
import Layout from '@/layout'
export default [
  {
    path: '/',
    component: Layout,
    redirect: '/dashboard',
    children: [
      {
        path: 'dashboard',
        name: 'Dashboard',
        component: () => import('@/views/dashboard/index'),
        meta: { title: '工作台', icon: 'wfapply', affix: true }
      }
    ]
  },
  {
    path: '/modify-pwd',
    component: Layout,
    redirect: '/modify-pwd/index',
    children: [
      {
        path: 'index',
        name: 'modify-pwd',
        component: () => import('@/views/user/Pwd'),
        meta: { title: '修改密码' }
      }
    ],
    hidden: true
  }
]
