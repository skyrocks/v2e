/*
 * @Author: shilei
 * @Date: 2020-09-22 11:06:14
 * @LastEditors: shilei
 * @LastEditTime: 2020-10-19 20:17:09
 * @Description: Api-Role
 * @FilePath: /aolong-parrot/src/api/role.js
 */
import request from '@/plugins/request'

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
    url: `/api/roles/${pageNum}/${pageSize}`,
    method: 'get',
    params: { filter, sort, params }
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
    url: '/api/roles',
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
    url: '/api/roles/update',
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
    url: '/api/roles/delete',
    method: 'post',
    data: roleIds
  })
}
