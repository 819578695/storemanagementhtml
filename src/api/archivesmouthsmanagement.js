import request from '@/utils/request'

export function getarchivesmouthsmanagementAll(params) {
  return request({
    url: 'api/getarchivesmouthsmanagementAll',
    method: 'get',
    params
  })
}

// 获取所有的房屋信息(根据部门)
export function archivesmouthsmanagementByDeptId(id) {
  return request({
    url: 'api/archivesmouthsmanagementByDeptId/'+id,
    method: 'get'
  })
}

// 获取所有的房屋信息(根据部门已出租)
export function findByDeptIdAndTenementNameIsNotNull(id) {
  return request({
    url: 'api/findByDeptIdAndTenementNameIsNotNull/'+id,
    method: 'get'
  })
}

// 获取所有的房屋信息(根据部门未出租)
export function findByDeptIdAndTenementNameIsNull(id) {
  return request({
    url: 'api/findByDeptIdAndTenementNameIsNull/'+id,
    method: 'get'
  })
}

export function add(data) {
  return request({
    url: 'api/archivesmouthsmanagement',
    method: 'post',
    data
  })
}

export function del(id) {
  return request({
    url: 'api/archivesmouthsmanagement/' + id,
    method: 'delete'
  })
}

export function edit(data) {
  return request({
    url: 'api/archivesmouthsmanagement',
    method: 'put',
    data
  })
}

export function uploadPictureExamine(data,contractNo) {
  return request({
    url: 'api/uploadPictureExamine/'+contractNo,
    method: 'post',
    data
  })
}
