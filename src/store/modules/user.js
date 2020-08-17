import { login, loginSMS, getInfo } from '@/api/user'
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
  // user login
  login({ commit }, userInfo) {
    const { loginName, password, captcha, captchaId } = userInfo
    return new Promise((resolve, reject) => {
      login({ loginName: loginName.trim(), password, captcha, captchaId })
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

  loginSMS({ commit }, userInfo) {
    const { id, cellphone, code } = userInfo
    return new Promise((resolve, reject) => {
      loginSMS({ id, cellphone: cellphone.trim(), code: code.trim() })
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

  // get user info
  getInfo({ commit }) {
    return new Promise((resolve, reject) => {
      getInfo()
        .then(response => {
          const { data } = response

          if (!data) {
            return reject('Verification failed, please Login again.')
          }

          const { userName } = data

          commit('SET_NAME', userName)
          //commit('SET_AVATAR', avatar)
          resolve(data)
        })
        .catch(error => {
          reject(error)
        })
    })
  },

  // user logout
  logout({ commit }) {
    return new Promise(resolve => {
      removeToken() // must remove  token  first
      resetRouter()
      commit('RESET_STATE')
      resolve()
      // logout(state.token)
      //   .then(() => {
      //     removeToken() // must remove  token  first
      //     resetRouter()
      //     commit('RESET_STATE')
      //     resolve()
      //   })
      //   .catch(error => {
      //     reject(error)
      //   })
    })
  },

  // remove token
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
