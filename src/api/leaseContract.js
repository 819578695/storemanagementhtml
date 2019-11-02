import request from '@/utils/request'

// 获取所有的园区(根据部门)
export function leaseContractByDeptId(id) {
  return request({
    url: 'api/leaseContractByDeptId/'+id,
    method: 'get'
  })
}

// 根据id查询
export function leaseContractById(id) {
  return request({
    url: 'api/leaseContractById/'+id,
    method: 'get'
  })
}

//审核操作
export function vertify(data,status) {
  return request({
    url: 'api/contractVertify?status=' + status,
    method: 'post',
    data,status
  })
}

export function add(data) {
  return request({
    url: 'api/leaseContract',
    method: 'post',
    data
  })
}

export function del(id) {
  return request({
    url: 'api/leaseContract/' + id,
    method: 'delete'
  })
}

export function edit(data) {
  return request({
    url: 'api/leaseContract',
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
