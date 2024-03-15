import router from '@/router'
import {
  login,
  userProfile
} from '@/api/user'
import {
  getToken,
  setToken,
  setStorage,
  clearStorage,
  getStorage
} from '@/utils/auth'

const state = {
  token: getToken(),
  time: '',
  walletShow: false,
  profileInfo: getStorage('profileInfo') || {},
}

const actions = {
  // 登录
  async login({
    commit
  }, info) {
    try {
      const res = await login(info)
      commit('SET_TOKEN', res.data.auth.token)
      //   await dispatch('getInfo')
    } catch (err) {
      return Promise.reject(err)
    }
  },

  // 获取钱包信息
  async getUserProfile({
    commit
  }, info) {
    try {
      const res = await userProfile(info)
      commit('SET_USER_PROFILE', res.data)
    } catch (err) {
      return Promise.reject(err)
    }
  },


  logout() {
    clearStorage()
    router.push('/login')
  }
}

const mutations = {
  SET_TOKEN(state, token) {
    state.token = token
    setToken(token)
  },
  UPDATE_CURRENT_TIME(state, time) {
    state.time = time
  },
  SET_USER_PROFILE(state, status) {
    state.profileInfo = status
    setStorage('profileInfo', (status))
  },
  UPDATE_WALLET_SHOW(state, status) {
    state.walletShow = status
  },
}

export default {
  namespaced: true,
  state,
  actions,
  mutations
}
