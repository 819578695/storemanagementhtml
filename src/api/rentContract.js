import request from '@/utils/request'

// 获取所有的园区(根据部门)
export function rentContractByDeptId(id) {
  return request({
    url: 'api/rentContractByDeptId/'+id,
    method: 'get'
  })
}

export function add(data) {
  return request({
    url: 'api/rentContract',
    method: 'post',
    data
  })
}

export function del(id) {
  return request({
    url: 'api/rentContract/' + id,
    method: 'delete'
  })
}

export function edit(data) {
  return request({
    url: 'api/rentContract',
    method: 'put',
    data
  })
}

export function upload(data,contractNo) {
  return request({
    url: 'api/upload/'+contractNo,
    method: 'post',
    data
  })
}
