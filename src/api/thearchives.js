import request from '@/utils/request'

export function add(data) {
  return request({
    url: 'api/basicsPark',
    method: 'post',
    data
  })
}

export function del(id) {
  return request({
    url: 'api/basicsPark/' + id,
    method: 'delete'
  })
}

export function edit(data) {
  return request({
    url: 'api/basicsPark',
    method: 'put',
    data
  })
}
