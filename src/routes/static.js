/*
 * @Author: shilei
 * @Date: 2020-10-15 17:14:23
 * @LastEditors: shilei
 * @LastEditTime: 2020-10-19 14:35:28
 * @Description: 静态路由
 * @FilePath: /aolong-parrot/src/routes/static.js
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
        component: () => import('@/views/dashboard'),
        meta: { title: '工作台', icon: 'wfapply', affix: true }
      }
    ]
  },
  {
    path: '/pwd',
    component: Layout,
    redirect: '/pwd/index',
    children: [
      {
        path: 'index',
        name: 'pwd',
        component: () => import('@/views/user/Pwd'),
        meta: { title: '修改密码' }
      }
    ],
    hidden: true
  }
]
