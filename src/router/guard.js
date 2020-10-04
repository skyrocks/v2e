import 'nprogress/nprogress.css'
import NProgress from 'nprogress'
import router from '.'
import store from '../store'
import getPageTitle from '@/utils/title'
import { getToken, fixToken } from '@/utils/token'
import { createDynamicRouter } from '@/router/menu'

NProgress.configure({ showSpinner: false })

// 不需要token的白名单
const whiteList = ['/login']

router.beforeEach(async (to, from, next) => {
  // start progress bar
  NProgress.start()

  // 动态设置页面Title
  document.title = getPageTitle(to.meta.title)

  const hasToken = getToken()
  if (hasToken) {
    fixToken() //单点登录模式下
    if (to.path === '/login') {
      // 如果是已登录状态,跳回首页,不允许重复登录
      next({ path: '/' })
      NProgress.done()
    } else {
      const hasGetUserInfo = store.getters.name
      if (hasGetUserInfo) {
        //登录后进入首页之后的所有页面
        next()
      } else {
        //登录后的首页
        try {
          await store.dispatch('auth/profile')
          await store.dispatch('menu/findAuthMenu')

          //创建动态路由,首页的菜单也是基于此路由构建
          createDynamicRouter()

          next({ ...to, replace: true })
        } catch (error) {
          await store.dispatch('auth/resetToken')
          next(`/login?redirect=${to.path}`)
          NProgress.done()
        }
      }
    }
  } else {
    if (whiteList.indexOf(to.path) !== -1) {
      next()
    } else {
      next(`/login?redirect=${to.path}`)
      NProgress.done()
    }
  }
})

router.afterEach(() => {
  NProgress.done()
})
