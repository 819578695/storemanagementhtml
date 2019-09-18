import request from '@/utils/request'

export function add(data) {
  return request({
    url: 'api/maintain',
    method: 'post',
    data
  })
}

export function del(id) {
  return request({
    url: 'api/maintain/' + id,
    method: 'delete'
  })
}

export function edit(data) {
  return request({
    url: 'api/maintain',
    method: 'put',
    data
  })

}
