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

export function getMarginCost(params) {
  return request({
    url: 'api/marginCost',
    method: 'get',
    params
  })
}

export function getMarginTree(params) {
  return request({
    url: 'api/marginTree',
    method: 'get',
    params
  })
}