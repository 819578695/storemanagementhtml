import request from '@/utils/request'

export function gettenantinformationAll(params) {
  return request({
    url: 'api/tenantinformation',
    method: 'get',
    params
  })
}

export function add(data) {
  return request({
    url: 'api/tenantinformation',
    method: 'post',
    data
  })
}

export function del(id) {
  return request({
    url: 'api/tenantinformation/' + id,
    method: 'delete'
  })
}

export function edit(data) {
  return request({
    url: 'api/tenantinformation',
    method: 'put',
    data
  })
}
