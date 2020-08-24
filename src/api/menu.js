import request from '@/utils/request'

export function findAuthMenu() {
  return request({
    url: '/api/menus/current',
    method: 'get'
  })
}
