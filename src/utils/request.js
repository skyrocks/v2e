import main from '@/main'
import axios from 'axios'
// import Qs from 'qs'
import { MessageBox, Message } from 'element-ui'
import store from '@/stores'
import { getToken } from '@/utils/token'

const againRequest = async response => {
  await store.dispatch('auth/refreshToken', getToken())
  const config = response.config
  config.headers['Authorization'] = getToken()
  const resp = await axios.request(config)
  return resp.data
}

// create an axios instance
const service = axios.create({
  baseURL: process.env.VUE_APP_BASE_API,
  // withCredentials: true, // send cookies when cross-domain requests
  timeout: 5000 // request timeout
})

service.interceptors.request.use(
  config => {
    if (getToken()) {
      config.headers['Authorization'] = getToken()
    }
    if (config.method === 'post') {
      if (config.data) {
        // 参数中数组的情况在调用的位置通过encodeURIComponent转换,其他情况并不需要特别转换
        // config.data = Qs.stringify(config.data)
      }
    } else {
      if (config.params) {
        /**
         * axios会对get请求的整个url进行encodeURI，导致有些get方法不能传[]，
         * 所以在此拦截器中抢先进行encodeURIComponent处理，避开axios的encodeURI
         * qs.stringify(config.params, {indices: false}) 等方法都不好用,不利用后台参数接收
         */
        let url = `${config.url}?`
        const keys = Object.keys(config.params)
        for (const key of keys) {
          let val = config.params[key]
          if (typeof val === 'object') {
            val = JSON.stringify(val)
          }
          url += `${key}=${encodeURIComponent(val)}&`
        }
        config.url = url.substring(0, url.length - 1)
        config.params = {}
      }
    }
    return config
  },
  error => {
    // console.log(error)
    return Promise.reject(error)
  }
)

// response interceptor
service.interceptors.response.use(
  response => {
    const res = response.data
    if (response.config.responseType === 'blob' || response.config.responseType === 'arraybuffer') {
      return res
    } else {
      if (!res.success) {
        if (res.code === 499) {
          // 499: 认证过期;
          return againRequest(response)
        } else {
          if (res.code === 401) {
            //console.log(_this.$route)
            // 401: 认证错误
            if (main.$route && main.$route.path !== '/login' && main.$route.path !== '/') {
              MessageBox.confirm('您已经登录超时, 您可以选择重新登录或者留在当前页面', '退出', {
                confirmButtonText: '重新登录',
                cancelButtonText: '留在当前页面',
                type: 'warning'
              }).then(() => {
                // 跳回登录
                location.reload()
              })
            }
          } else if (res.code === 901 || res.code === 498) {
            // 901: 业务错误, 498: 账号禁用类错误
            Message({
              message: res.message || 'Error',
              type: 'error',
              duration: 5 * 1000
            })
          } else {
            // 900: 不可预知, // 403 禁止访问
            // console.log(res)
          }
          return Promise.reject(res)
        }
      } else {
        return res
      }
    }
  },
  error => {
    // console.log(error)
    Message({
      message: '数据请求异常',
      type: 'error',
      duration: 5 * 1000
    })
    return Promise.reject(error)
  }
)

export default service
