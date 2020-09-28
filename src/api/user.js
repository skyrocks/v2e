import request from '@/plugins/request'
import { Message } from 'element-ui'

/**
 * 查询所有用户
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
    url: `/api/users/${pageNum}/${pageSize}`,
    method: 'get',
    params: { filter, sort, params }
  })
}

/**
 * 创建虚拟用户
 *
 * @export
 * @param {*} data
 * @returns
 */
export function create(data) {
  return request({
    url: '/api/users',
    method: 'post',
    data
  })
}

/**
 * 更新用户信息
 *
 * @export
 * @param {*} data
 * @returns
 */
export function update(data) {
  return request({
    url: '/api/users/update',
    method: 'post',
    data
  })
}

/**
 * 删除虚拟用户
 *
 * @export
 * @param {*} userIds
 * @returns
 */
export function remove(userIds) {
  return request({
    url: '/api/users/remove',
    method: 'post',
    data: userIds
  })
}

/**
 * 更新用户状态
 *
 * @export
 * @param {*} userIds
 * @param {*} status
 * @returns
 */
export function updateStatus(userIds, status) {
  return request({
    url: '/api/users/update/status',
    method: 'post',
    data: { userIds: encodeURIComponent(userIds), status }
  })
}

/**
 * 更新用户密码
 *
 * @export
 * @param {*} userIds
 * @param {*} pwd
 * @returns
 */
export function updatePwd(userIds, pwd) {
  return request({
    url: '/api/users/update/pwd',
    method: 'post',
    data: { userIds: encodeURIComponent(userIds), pwd }
  })
}

/**
 * 更新用户有效期
 *
 * @export
 * @param {*} userIds
 * @param {*} expiry
 * @returns
 */
export function updateExpiry(userIds, expiry) {
  return request({
    url: '/api/users/update/expiry',
    method: 'post',
    data: { userIds: encodeURIComponent(userIds), expiry }
  })
}

/**
 * 添加用户角色
 *
 * @export
 * @param {*} userId
 * @param {*} roleIds
 * @returns
 */
export function addRoles(userId, roleIds) {
  return request({
    url: `/api/users/create/role/${userId}`,
    method: 'post',
    data: { roleIds: encodeURIComponent(roleIds) }
  })
}

/**
 * 删除用户角色
 *
 * @export
 * @param {*} userId
 * @param {*} roleId
 * @returns
 */
export function removeRole(userId, roleId) {
  return request({
    url: `/api/users/remove/role/${roleId}/${userId}`,
    method: 'post'
  })
}

/**
 * 验证账号,邮箱,手机号码是否存在
 *
 * @export
 * @param {*} field
 * @param {*} value
 * @returns
 */
export function validate(field, value, excludeUserId = '') {
  return request({
    url: `/api/users/validate/${field}/${value}`,
    method: 'get',
    params: { excludeUserId }
  })
}

export function browserPhoto(userId) {
  return request({
    url: `/api/users/photo/${userId}`,
    responseType: 'blob',
    method: 'get'
  })
}

export function download(data) {
  return new Promise((resolve, reject) => {
    request({
      url: '/api/users/download',
      responseType: 'blob',
      method: 'post',
      data
    })
      .then(res => {
        const blob = new Blob([res])
        const url = URL.createObjectURL(blob)
        const link = document.createElement('a')
        link.style.display = 'none'
        link.href = url
        link.setAttribute('download', '模板文档.docx')
        link.click()
        resolve()
      })
      .catch(error => {
        Message({
          message: '下载文件错误',
          type: 'error',
          duration: 5 * 1000
        })
        reject(error)
      })
  })
}

export function testGet(params) {
  return request({
    url: '/api/users/test',
    method: 'get',
    params
  })
}

export function testPost(data) {
  return request({
    url: '/api/users/test',
    method: 'post',
    data
  })
}
