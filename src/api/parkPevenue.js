import request from '@/utils/request'

export function getParkPevenueAll(params) {
  return request({
    url: 'api/parkPevenueAll',
    method: 'get',
    params
  })
}

export function add(data) {
  return request({
    url: 'api/parkPevenue',
    method: 'post',
    data
  })
}

export function vertify(data,status) {
  return request({
    url: 'api/pevenueVertify?status=' + status,
    method: 'post',
    data,status
  })
}

export function del(id) {
  return request({
    url: 'api/parkPevenue/' + id,
    method: 'delete'
  })
}

export function edit(data) {
  return request({
    url: 'api/parkPevenue',
    method: 'put',
    data
  })
}

export function payBack(data) {
  return request({
    url: 'api/parkPevenuePayBack',
    method: 'put',
    data
  })
}

export function findPevenueMoney(deptId) {
  return request({
    url: 'api/findPevenueMoney/'+deptId,
    method: 'get',
  })
}
