import { login, loginSms, refreshToken, profile } from '@/api/auth'
import { getToken, setToken, removeToken } from '@/utils/token'
import { resetRouter } from '@/router'

const getDefaultState = () => {
  return {
    token: getToken(),
    name: '',
    avatar: ''
  }
}

const state = getDefaultState()

const mutations = {
  RESET_STATE: state => {
    Object.assign(state, getDefaultState())
  },
  SET_TOKEN: (state, token) => {
    state.token = token
  },
  SET_NAME: (state, name) => {
    state.name = name
  },
  SET_AVATAR: (state, avatar) => {
    state.avatar = avatar
  }
}

const actions = {
  login({ commit }, userInfo) {
    const { loginName, password, captcha, captchaId } = userInfo
    return new Promise((resolve, reject) => {
      login({ loginName: loginName.trim(), password, captcha: captcha.trim(), captchaId })
        .then(response => {
          const { data } = response
          commit('SET_TOKEN', data)
          setToken(data)
          resolve()
        })
        .catch(error => {
          reject(error)
        })
    })
  },

  loginSms({ commit }, userInfo) {
    const { id, cellphone, code } = userInfo
    return new Promise((resolve, reject) => {
      loginSms({ id, cellphone: cellphone.trim(), code: code.trim() })
        .then(response => {
          const { data } = response
          commit('SET_TOKEN', data)
          setToken(data)
          resolve()
        })
        .catch(error => {
          reject(error)
        })
    })
  },

  refreshToken({ commit }, token) {
    return new Promise((resolve, reject) => {
      refreshToken({ token })
        .then(response => {
          const { data } = response
          commit('SET_TOKEN', data)
          setToken(data)
          resolve()
        })
        .catch(error => {
          reject(error)
        })
    })
  },

  profile({ commit }) {
    return new Promise((resolve, reject) => {
      profile()
        .then(response => {
          console.log(`get info ${response}`)
          const { data } = response
          commit('SET_NAME', data.userName)
          // todo commit('SET_AVATAR', avatar)
          resolve(data)
        })
        .catch(error => {
          console.log(`get info ${JSON.stringify(error)}`)
          reject(error)
        })
    })
  },

  logout({ commit }) {
    return new Promise(resolve => {
      removeToken()
      resetRouter()
      commit('RESET_STATE')
      resolve()
    })
  },

  resetToken({ commit }) {
    return new Promise(resolve => {
      removeToken() // must remove  token  first
      commit('RESET_STATE')
      resolve()
    })
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}
