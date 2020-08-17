import request from '@/utils/request'

export function findMyMenu() {
  return request({
    url: '/api/menu/myMenu',
    method: 'get'
  })
}
