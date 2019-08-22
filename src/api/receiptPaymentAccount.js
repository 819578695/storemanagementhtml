import request from '@/utils/request'

// 获取所有的收付款信息
export function getAll() {
  return request({
    url: 'api/receiptPaymentAccount/all',
    method: 'get'
  })
}

export function add(data) {
  return request({
    url: 'api/receiptPaymentAccount',
    method: 'post',
    data
  })
}

export function del(id) {
  return request({
    url: 'api/receiptPaymentAccount/' + id,
    method: 'delete'
  })
}

export function edit(data) {
  return request({
    url: 'api/receiptPaymentAccount',
    method: 'put',
    data
  })
}
