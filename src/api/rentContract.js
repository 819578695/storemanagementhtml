import request from '@/utils/request'

export function add(data) {
  return request({
    url: 'api/rentContract',
    method: 'post',
    data
  })
}

export function del(id) {
  return request({
    url: 'api/rentContract/' + id,
    method: 'delete'
  })
}

export function edit(data) {
  return request({
    url: 'api/rentContract',
    method: 'put',
    data
  })
}
