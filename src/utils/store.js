import Cookies from 'js-cookie'
import Storage from './storage'

export default {
  get(key) {
    if (window.localStorage) {
      return Storage.get(key)
    } else {
      return Cookies.get(key)
    }
  },

  set(key, value) {
    if (window.localStorage) {
      Storage.set(key, value)
    } else {
      Cookies.set(key, value)
    }
  },

  remove(key) {
    if (window.localStorage) {
      Storage.remove(key)
    } else {
      Cookies.remove(key)
    }
  }
}
