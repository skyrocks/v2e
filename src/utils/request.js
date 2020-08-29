import _this from '@/main'
import axios from 'axios'
import { MessageBox, Message } from 'element-ui'
import store from '@/store'
import { getToken } from '@/utils/token'

const againRequest = async response => {
  await store.dispatch('auth/refreshToken', getToken())
  let config = response.config
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

// request interceptor
service.interceptors.request.use(
  config => {
    if (store.getters.token) {
      config.headers['Authorization'] = getToken()
    }
    return config
  },
  error => {
    console.log(error)
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
          //499: 认证过期;
          return againRequest(response)
        } else {
          if (res.code === 401) {
            // 401: 认证错误
            if (_this.$route && _this.$route.path === '/login') {
              location.reload()
            } else {
              // 测试
              Message({
                message: _this.$route.path,
                type: 'error',
                duration: 5 * 1000
              }) // test end
              MessageBox.confirm('您已经登录超时, 您可以选择重新登录或者留在当前页面', '退出', {
                confirmButtonText: '重新登录',
                cancelButtonText: '留在当前页面',
                type: 'warning'
              }).then(() => {
                // 跳回登录
                location.reload()
              })
            }
          } else if (res.code === 901) {
            // 901: 业务错误
            Message({
              message: res.message || 'Error',
              type: 'error',
              duration: 5 * 1000
            })
          } else {
            // 900: 不可预知, // 403 禁止访问
            console.log(res)
          }
          return Promise.reject(res)
        }
      } else {
        return res
      }
    }
  },
  error => {
    Message({
      message: '数据请求异常',
      type: 'error',
      duration: 5 * 1000
    })
    return Promise.reject(error)
  }
)

export default service
