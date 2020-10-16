/*
 * @Author: shilei
 * @Date: 2020-08-22 23:53:00
 * @LastEditors: shilei
 * @LastEditTime: 2020-10-16 16:57:41
 * @Description: 这是一个什么文件...
 * @FilePath: /aolong-parrot/src/store/modules/menu.js
 */
import { findAuthMenu } from '@/api/menu'

const getDefaultState = () => {
  return {
    menus: [],
    routes: []
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
