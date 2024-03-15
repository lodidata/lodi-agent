import axios from 'axios'
import {
  Loading,
  Message
} from 'element-ui'
import store from '@/store'
import {
  getToken
} from './auth'
import {
  errorStatus
} from './variables'
import i18n from "../lang" // 国际化

let loadingNum = 0
let globalLoading = null
const setLoading = () => {
  loadingNum += 1
  if (loadingNum === 1) {
    globalLoading = Loading.service({
      //   target: '#app',
      background: 'rgba(0,0,0,0.7)',
      // 避免遮罩层级不够
      customClass: 'global-loading'
    })
  }
}
const deleteLoading = () => {
  loadingNum -= 1
  if (loadingNum === 0) {
    // 关闭loading
    globalLoading?.close()
    // 手动释放
    globalLoading = null
  }
}


// ssl
const protocol = window.location.protocol.indexOf('https') >= 0 ? 'https://' : 'http://'
const baseUrl = `${protocol}${window.setting.reqUrl}`

const service = axios.create({
  baseURL: baseUrl,
  // withCredentials: true,
  timeout: 10000
})

const errorHandler = error => {
  deleteLoading()
  const status = error ?.response ?.status
  error.message = i18n.t(errorStatus[status]) || i18n.t("systemError.txt15")
  Message.error(error.message)
  if ([401].includes(status)) {
    store.dispatch('user/logout')
  }
  return Promise.reject(error)
}

service.interceptors.request.use(
  config => {
    const {
      loading
    } = config
    if (typeof loading === 'undefined' || loading === true) {
      setLoading()
    }
    let lang = localStorage.getItem("language") || window.setting.lang,
      txt = ''
    if (lang === 'zh') {
      txt = 'zh-cn'
    } else if (lang === 'th') {
      txt = 'th'
    } else {
      txt = 'en-us'
    }
    config.headers.lang = txt
    if (store.getters.token) {

      config.headers.Authorization = getToken()
      config.headers.formVersionNo = store.getters.time
    }
    return config
  },
  error => errorHandler(error)
)

service.interceptors.response.use(
  response => {
    const {
      data,
      config
    } = response
    const {
      loading,
      responseType
    } = config
    if (typeof loading === 'undefined' || loading === true) {
      deleteLoading()
    }
    if (responseType === 'blob') return data
    // 根据后端返回值判断
    if ([1, 0, 166].includes(data.state)) {
      return data
    }
    Message.error(data.message)
    return Promise.reject(data)
  },
  error => errorHandler(error)
)

export function post(url, ...config) {
  return service.post(url, ...config)
}
export function put(url, ...config) {
  return service.put(url, ...config)
}
export function del(url, params, config) {
  return service.delete(url, {
    params,
    ...config
  })
}
export function get(url, params, config) {
  return service.get(url, {
    params,
    ...config
  })
}
