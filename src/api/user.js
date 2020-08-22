import request from '@/utils/request'

export function login(data) {
  return request({
    url: '/api/auth/login',
    method: 'post',
    data
  })
}

export function loginError() {
  return request({
    url: '/api/auth/login/error',
    method: 'get'
  })
}

export function getInfo() {
  return request({
    url: '/api/auth/profile',
    method: 'get'
  })
}

export function logout() {
  return request({
    url: '/api/auth/logout',
    method: 'post'
  })
}

export function sendSmsCode(data) {
  return request({
    url: '/api/auth/sms/code',
    method: 'post',
    data
  })
}

export function loginSms(data) {
  return request({
    url: '/api/auth/sms/login',
    method: 'post',
    data
  })
}

export function refreshToken(data) {
  return request({
    url: '/api/auth/refreshToken',
    method: 'post',
    data
  })
}