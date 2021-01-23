import { login, loginSms, refreshToken, profile } from '@/api/auth'
import { getToken, setToken, removeToken } from '@/utils/token'
import { resetRouter } from '@/routes'

const getDefaultState = () => {
  return {
    token: getToken(),
    userId: '',
    loginName: '',
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
  SET_ID: (state, userId) => {
    state.userId = userId
  },
  SET_LOGINNAME: (state, loginName) => {
    state.loginName = loginName
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
          setToken(data)
          commit('SET_TOKEN', getToken())
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
          const { data } = response
          commit('SET_ID', data.userId)
          commit('SET_LOGINNAME', data.loginName)
          commit('SET_NAME', data.userName)
          resolve(data)
        })
        .catch(error => {
          reject(error)
        })
    })
  },

  logout({ commit }) {
    removeToken()
    resetRouter()
    commit('RESET_STATE')
  },

  resetToken({ commit }) {
    removeToken()
    commit('RESET_STATE')
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}
