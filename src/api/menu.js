import request from '@/utils/request'

/**
 * 获取登录用户的所有权限的菜单列表
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

/**
 * 获取所有菜单及功能
 *
 * @export
 * @returns
 */
export function findMenus() {
  return request({
    url: '/api/menus',
    method: 'get'
  })
}

/**
 * 给角色授权菜单及权限
 *
 * @export
 * @param {*} roleId
 * @param {*} data //包括4个节点trueNodeIds, trueFuncKeys, falseNodeIds, falseFuncKeys
 * @returns
 */
export function authMenus(roleId, trueNodeIds, trueFuncKeys, falseNodeIds, falseFuncKeys) {
  return request({
    url: '/api/menus/auth',
    method: 'post',
    data: {
      roleId,
      trueNodeIds: encodeURIComponent(trueNodeIds),
      trueFuncKeys: encodeURIComponent(trueFuncKeys),
      falseNodeIds: encodeURIComponent(falseNodeIds),
      falseFuncKeys: encodeURIComponent(falseFuncKeys)
    }
  })
}

/**
 * 获取角色的授权菜单ID及功能ID
 *
 * @export
 * @param {*} roleId
 * @returns
 */
export function findRoleAuthMenu(roleId) {
  return request({
    url: `/api/menus/auth/${roleId}`,
    method: 'get'
  })
}
