import userApis from './const/api'
import request from '../../base/utils/request'
export function getUsers(cancel) {
  return request(userApis.getUserList, {
    params: {
      page: 1,
      page_size: 20
    },
    getCancelMethod: cancel
  })
}

export function updateUser(userId, data) {
  return request(userApis.updateUser, {
    params: {
      id: userId
    },
    data
  })
}
export function deleteUser(userId) {
  return request(userApis.deleteUser, {
    params: {
      id: userId
    }
  })
}
