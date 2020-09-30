import Cookies from 'js-cookie'
import Storage from './storage'

export default {
  get(key) {
    if (window.localStorage) {
      const val = Storage.get(key)
      if (val) {
        try {
          return JSON.parse(val)
        } catch {
          return val
        }
      } else {
        return val
      }
    } else {
      return Cookies.get(key)
    }
  },

  set(key, value) {
    if (window.localStorage) {
      if (typeof value === 'object') {
        Storage.set(key, JSON.stringify(value))
      } else {
        Storage.set(key, value)
      }
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
