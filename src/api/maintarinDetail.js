import request from '@/utils/request'

export function add(data) {
  return request({
    url: 'api/maintarinDetail',
    method: 'post',
    data
  })
}

export function addDetail(data) {
  return request({
    url: 'api/maintarinDetailAdd',
    method: 'post',
    data
  })
}

export function del(id) {
  return request({
    url: 'api/maintarinDetail/' + id,
    method: 'delete'
  })
}

export function edit(data) {
  return request({
    url: 'api/maintarinDetail',
    method: 'put',
    data
  })
}

export function getMoney(params){
	return request({
		url: 'api/getMoney',
		method: 'get',
		params
	})
}