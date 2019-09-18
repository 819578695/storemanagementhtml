import request from '@/utils/request'

export function add(data) {
  return request({
    url: 'api/basicsClient',
    method: 'post',
    data
  })
}

export function del(id) {
  return request({
    url: 'api/basicsClient/' + id,
    method: 'delete'
  })
}

export function edit(data) {
  return request({
    url: 'api/basicsClient',
    method: 'put',
    data
  })
}
