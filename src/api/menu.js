import request from '@/utils/request'

export function findAuthMenu() {
  return request({
    url: '/api/menu/findAuthMenu',
    method: 'get'
  })
}
