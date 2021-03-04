import axios from 'axios'

const instance = axios.create({
  baseURL: process.env.VUE_APP_URL,
  timeout: 3000
})

// 设置 post、put 默认 Content-Type
instance.defaults.headers.post['Content-Type'] = 'application/json'
instance.defaults.headers.put['Content-Type'] = 'application/json'

instance.interceptors.request.use(config => {
  if (config.method === 'post' || config.method === 'put') {
    config.data = JSON.stringify(config.data)
  }
  return config
})

instance.interceptors.response.use(res => {
  return res.data.data
}, error => {
  return Promise.reject(error)
})

export const request = (opts) => {
  return instance(opts)
}
