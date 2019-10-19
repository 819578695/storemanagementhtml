import request from '@/utils/request'

// 获取所有的收付款信息
export function findByDetail() {
  return request({
    url: 'api/receiptPaymentAccount/all',
    method: 'get'
  })
}

export function findByDept(deptId){
	return request({
		url: 'api/receiptPaymentAccount/'+deptId,
    method: 'get',
  })
}

export function add(data) {
  return request({
    url: 'api/receiptPaymentAccount',
    method: 'post',
    data
  })
}

export function receiptPaymentAccountById(id) {
  return request({
    url: 'api/receiptPaymentAccountById/'+id,
    method: 'get'
  })
}


export function receiptPaymentAccountByDeptId(dictailId,deptId) {
  return request({
    url: 'api/receiptPaymentAccountByDeptId/'+dictailId+'/'+deptId,
    method: 'get'
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
