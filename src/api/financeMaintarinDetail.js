import request from '@/utils/request'

export function add(data) {
  return request({
    url: 'api/financeMaintarinDetail',
    method: 'post',
    data
  })
}

export function del(id) {
  return request({
    url: 'api/financeMaintarinDetail/' + id,
    method: 'delete'
  })
}

export function edit(data) {
  return request({
    url: 'api/financeMaintarinDetail',
    method: 'put',
    data
  })
}
