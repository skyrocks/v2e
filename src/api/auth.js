import request from '@/utils/request'

/**
 * 登录
 *
 * @export
 * @param {*} data
 * @returns
 */
export function login(data) {
  return request({
    url: '/api/auth/login',
    method: 'post',
    data
  })
}

/**
 * 刷新token
 *
 * @export
 * @param {*} data
 * @returns
 */
export function refreshToken(data) {
  return request({
    url: '/api/auth/refresh-token',
    method: 'post',
    data
  })
}

/**
 * 获取CAS模式下的token
 *
 * @export
 * @returns
 */
export function getCasToken(jSessionId) {
  return request({
    url: `/cas/token/${jSessionId}`,
    method: 'post'
  })
}

/**
 * 获取登录后的user信息
 *
 * @export
 * @returns
 */
export function profile() {
  return request({
    url: '/api/auth/profile',
    method: 'get'
  })
}

/**
 * 判断当前IP是否存在登录错误
 *
 * @export
 * @returns
 */
export function loginError() {
  return request({
    url: '/api/auth/login/error',
    method: 'get'
  })
}

/**
 * 注销
 *
 * @export
 * @returns
 */
export function logout(loginName) {
  return request({
    url: `/api/auth/logout/${loginName}`,
    method: 'post'
  })
}

/**
 * 发送手机短信验证码
 *
 * @export
 * @param {*} data
 * @returns
 */
export function sendSmsCode(data) {
  return request({
    url: '/api/auth/sms/code',
    method: 'post',
    data
  })
}

/**
 * 手机短信登录
 *
 * @export
 * @param {*} data
 * @returns
 */
export function loginSms(data) {
  return request({
    url: '/api/auth/sms/login',
    method: 'post',
    data
  })
}
