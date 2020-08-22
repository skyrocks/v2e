import { findAuthMenu } from '@/api/menu'

const getDefaultState = () => {
  return {
    menus: []
  }
}

const state = getDefaultState()

const mutations = {
  SET_MENUS: (state, menus) => {
    state.menus = menus
  }
}

const actions = {
  findAuthMenu({ commit }) {
    return new Promise((resolve, reject) => {
      findAuthMenu()
        .then(response => {
          const { data } = response
          commit('SET_MENUS', data)
          resolve()
        })
        .catch(error => {
          reject(error)
        })
    })
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}
