import request from '@/utils/request'

export function gettenantinformationAll(params) {
  return request({
    url: 'api/gettenantinformationAll',
    method: 'get',
    params
  })
}

export function tenantinformationByDeptId(id) {
  return request({
    url: 'api/tenantinformationByDeptId/'+id,
    method: 'get',
  })
}

export function tenantinformationByArchivesmouthsmanagementId(id) {
  return request({
    url: 'api/tenantinformationByArchivesmouthsmanagementId/'+id,
    method: 'get',
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

export function particulars(id) {
  return request({
    url: 'api/particulars/' + id,
    method: 'get'
  })
}
