import { post } from './index'

export const sendMsg = (data) => {
  return post('/api/join', data)
}
