import Store from './store'

export function getToken() {
  return Store.get(window.__C.K_TOKEN)
}

export function setToken(token) {
  Store.set(window.__C.K_TOKEN, `Bearer ${token}`)
}

export function removeToken() {
  Store.remove(window.__C.K_TOKEN)
}

export const HeaderToken = { Authorization: getToken() }
