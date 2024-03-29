import request from '@/utils/request'


// 获取所有的园区(根据部门)
export function basicsParkByDeptId(id) {
  return request({
    url: 'api/basicsParkByDeptId/'+id,
    method: 'get'
  })
}

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

export function uploadPicture(data,contractNo) {
  return request({
    url: 'api/uploadPicture/'+contractNo,
    method: 'post',
    data
  })
}

export function basicsParkContract(deptId) {
  return request({
    url: 'api/basicsParkContract/' + deptId,
    method: 'get'
  })
}
