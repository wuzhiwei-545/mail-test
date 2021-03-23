import { createStore } from 'vuex'
import { getMsg } from '@/assets/api/home.js'

export default createStore({
  state: {
    mailList: []
  },

  mutations: {
    updateMailList (state, payload) {
      state.mailList = payload
    }
  },

  actions: {
    async setMailList ({commit}) {
      const list = await getMsg()
      commit('updateMailList', list)
    }
  }
})