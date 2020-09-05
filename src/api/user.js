import request from '@/plugins/request'
import { Message } from 'element-ui'

export function findAll(params, filter, sort, pageNum, pageSize = window.__C.P_PAGESIZE) {
  return request({
    url: `/api/users/${pageNum}/${pageSize}`,
    method: 'get',
    params: { filter, sort, params }
    // params: {
    //   filter: filter !== undefined ? JSON.stringify(filter) : '',
    //   sort: sort !== undefined ? JSON.stringify(sort) : ''
    // }
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
