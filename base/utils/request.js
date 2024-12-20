import axios from 'axios'
import { Notification } from 'element-ui'

const instance = axios.create()
const CancelToken = axios.CancelToken

//处理url中的参数
instance.interceptors.request.use(function (config) {
  let url = config.url
  let params = config.params
  url = url.replace(/{(\w+)}/g, function (match, $1) {
    if (params[$1]) {
      let value = params[$1]
      delete params[$1]
      return encodeURIComponent(value)
    }
  })
  config.url = url
  return config
})

//提取请求url中的method
instance.interceptors.request.use(function (config) {
  let urlConfig = config.url.split(/\s+/)
  if (urlConfig.length > 1) {
    config.method = urlConfig[0].toLowerCase()
    config.url = urlConfig[1]
  }
  return config
})

//处理获取取消请求的配置
instance.interceptors.request.use(function (config) {
  if (config.getCancelMethod && typeof config.getCancelMethod === 'function') {
    config.cancelToken = new CancelToken(function executor(c) {
      config.getCancelMethod(c)
    })

    delete config.getCancelMethod
  }
  return config
})

// 成功、失败处理
instance.interceptors.response.use(
  function (response) {
    let { code, data, message } = response.data || {}
    if (code && code === 200) {
      return Promise.resolve(data)
    } else {
      Notification({
        message: message || '接口错误',
        type: 'error'
      })
      return Promise.reject(response.data)
    }
  },
  function (error) {
    if (error instanceof axios.AxiosError) {
      switch (error.response.status) {
        case 401:
          location.href = '/login'
          return
        default: {
          Notification({
            message: error.message || '接口异常',
            type: 'error'
          })
        }
      }
    }
    return Promise.reject(error)
  }
)

export default instance
