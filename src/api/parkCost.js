import request from '@/utils/request'

export function getParkCostAll(params) {
  return request({
    url: 'api/parkCostAll',
    method: 'get',
    params
  })
}

export function add(data) {
  return request({
    url: 'api/parkCost',
    method: 'post',
    data
  })
}

export function del(id) {
  return request({
    url: 'api/parkCost/' + id,
    method: 'delete'
  })
}

export function edit(data) {
  return request({
    url: 'api/parkCost',
    method: 'put',
    data
  })
}

export function findCostsMoney(deptId) {
  return request({
    url: 'api/findCostsMoney/'+deptId,
    method: 'get',
  })
}
