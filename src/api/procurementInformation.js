import request from '@/utils/request'

export function getProcurementInformationAll(params) {
  return request({
    url: 'api/procurementInformationAll',
    method: 'get',
    params
  })
}

export function add(data) {
  return request({
    url: 'api/procurementInformation',
    method: 'post',
    data
  })
}

export function del(id) {
  return request({
    url: 'api/procurementInformation/' + id,
    method: 'delete'
  })
}

export function edit(data) {
  return request({
    url: 'api/procurementInformation',
    method: 'put',
    data
  })
}
