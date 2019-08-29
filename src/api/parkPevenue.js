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