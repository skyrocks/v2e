import request from '@/plugins/request'

export function findAll(params, filter, sort, pageNum, pageSize = window.__C.P_PAGESIZE) {
  return request({
    url: `/api/roles/${pageNum}/${pageSize}`,
    method: 'get',
    params: { filter, sort, params }
  })
}
