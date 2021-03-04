import { request } from '@/utils/request'

export const get = (url, params) => {
  return request({
    method: 'get',
    url,
    params
  })
}

export const post = (url, data) => {
  return request({
    method: 'post',
    url,
    data
  })
}