import request from '@/utils/request'

export function add(data) {
  return request({
    url: 'api/margin',
    method: 'post',
    data
  })
}

export function del(id) {
  return request({
    url: 'api/margin/' + id,
    method: 'delete'
  })
}

export function edit(data) {
  return request({
    url: 'api/margin',
    method: 'put',
    data
  })
}

export function getMarginTree() {
  return request({
    url: 'api/marginTree',
    method: 'get',
  })
}