import request from '@/utils/request'

/**
 * 添加日志
 *
 * @export
 * @param {*} data
 * @returns
 */
export function create(data) {
  return request({
    url: '/logs/pc',
    method: 'post',
    data
  })
}
