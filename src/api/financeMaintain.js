import request from '@/utils/request'

export function add(data) {
  return request({
    url: 'api/financeMaintain',
    method: 'post',
    data
  })
}

export function del(id) {
  return request({
    url: 'api/financeMaintain/' + id,
    method: 'delete'
  })
}

export function edit(data) {
  return request({
    url: 'api/financeMaintain',
    method: 'put',
    data
  })
}
