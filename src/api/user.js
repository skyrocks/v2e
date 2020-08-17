import request from '@/utils/request'

export function login(data) {
  return request({
    url: '/api/auth/login',
    method: 'post',
    data
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

export function sendCode(data) {
  return request({
    url: '/api/auth/sms/code',
    method: 'post',
    data
  })
}

export function loginSMS(data) {
  return request({
    url: '/api/auth/sms/login',
    method: 'post',
    data
  })
}
