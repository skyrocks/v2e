import request from '@/plugins/request'

export function findAuthMenu() {
  return request({
    url: '/api/menus/current',
    method: 'get'
  })
}
