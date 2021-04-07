/*
 * @Author: shilei
 * @Date: 2020-09-22 11:06:14
 * @LastEditors: shilei
 * @LastEditTime: 2020-10-20 12:10:03
 * @Description: Api-Role
 * @FilePath: /aolong-parrot/src/api/role.js
 */
import request from '@/utils/request'

/**
 * 查询角色
 *
 * @export
 * @param {*} params
 * @param {*} filter
 * @param {*} sort
 * @param {*} pageNum
 * @param {*} [pageSize=window.__C.P_PAGESIZE]
 * @returns
 */
export function findAll(params, filter, sort, pageNum, pageSize = window.__C.P_PAGESIZE) {
  return request({
    url: `/roles/${pageNum}/${pageSize}`,
    method: 'get',
    params: { filter, sort, params }
  })
}

/**
 * 查询角色下的所有用户
 *
 * @export
 * @param {*} roleId
 * @param {*} filter
 * @param {*} sort
 * @param {*} pageNum
 * @param {*} [pageSize=window.__C.P_PAGESIZE]
 * @returns
 */
export function findUsers(roleId, filter, sort, pageNum, pageSize = window.__C.P_PAGESIZE) {
  return request({
    url: `/roles/users/${roleId}/${pageNum}/${pageSize}`,
    method: 'get',
    params: { filter, sort }
  })
}

/**
 * 创建角色
 *
 * @export
 * @param {*} data
 * @returns
 */
export function create(data) {
  return request({
    url: '/roles',
    method: 'post',
    data
  })
}

/**
 * 修改角色
 *
 * @export
 * @param {*} data
 * @returns
 */
export function update(data) {
  return request({
    url: '/roles/update',
    method: 'post',
    data
  })
}

/**
 * 删除角色
 *
 * @export
 * @param {*} roleIds
 * @returns
 */
export function remove(roleIds) {
  return request({
    url: '/roles/delete',
    method: 'post',
    data: roleIds
  })
}

/**
 * 删除角色下的用户
 *
 * @export
 * @param {*} roleId
 * @param {*} userIds
 * @returns
 */
export function removeUsers(roleId, userIds) {
  return request({
    url: '/roles/delete/users',
    method: 'post',
    data: { roleId, userIds: encodeURIComponent(userIds) }
  })
}

/**
 * 添加角色下的用户
 *
 * @export
 * @param {*} roleId
 * @param {*} userIds
 * @returns
 */
export function addUsers(roleId, userIds) {
  return request({
    url: '/roles/create/users',
    method: 'post',
    data: { roleId, userIds: encodeURIComponent(userIds) }
  })
}
