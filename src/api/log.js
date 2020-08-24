import request from '@/utils/request'

export function create(data) {
  return request({
    url: '/api/user-logs/pc',
    method: 'post',
    data
  })
}
