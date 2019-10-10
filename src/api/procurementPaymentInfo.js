import request from '@/utils/request'

export function add(data) {
  return request({
    url: 'api/procurementPaymentInfo',
    method: 'post',
    data
  })
}

export function findByProcurementPaymentInfoById(id) {
  return request({
    url: 'api/procurementPaymentInfoById/'+ id,
    method: 'get',
  })
}

export function del(id) {
  return request({
    url: 'api/procurementPaymentInfo/' + id,
    method: 'delete'
  })
}

export function edit(data) {
  return request({
    url: 'api/procurementPaymentInfo',
    method: 'put',
    data
  })
}
