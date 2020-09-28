import request from '@/plugins/request'

/**
 * 获取登录用户的有权限的菜单列表
 *
 * @export
 * @returns
 */
export function findAuthMenu() {
  return request({
    url: '/api/menus/current',
    method: 'get'
  })
}
