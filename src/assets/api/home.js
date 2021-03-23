import { post, get } from './index'

export const sendMsg = (data) => {
  return post('/api/send', data)
}

export const getMsg = () => {
  return get('/api/get/message')
}

export const upload = (data) => {
  return post('/api/upload', data)
}

export const login = (data) => {
  return post('/api/login', data)
}