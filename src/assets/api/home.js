import { post, get } from './index'

export const sendMsg = (data) => {
  return post('/api/join', data)
}

export const getMsg = () => {
  return get('/api/get/message')
}