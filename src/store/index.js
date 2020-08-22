import Vue from 'vue'
import Vuex from 'vuex'
import getters from './getters'
import settings from './modules/settings'
import app from './modules/app'
import auth from './modules/auth'
import menu from './modules/menu'

Vue.use(Vuex)

const store = new Vuex.Store({
  modules: {
    settings,
    app,
    auth,
    menu
  },
  getters
})

export default store
