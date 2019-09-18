import request from '@/utils/request'

export function add(data) {
  return request({
    url: 'api/fundFlowing',
    method: 'post',
    data
  })
}

export function del(id) {
  return request({
    url: 'api/fundFlowing/' + id,
    method: 'delete'
  })
}

export function edit(data) {
  return request({
    url: 'api/fundFlowing',
    method: 'put',
    data
  })
}

export function getFundFlowing(params){
	return request({
		url: 'api/fundFlowingAll',
		method: 'get',
		params
	})
}
