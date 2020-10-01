import Cookies from 'js-cookie'

export function getToken() {
  return Cookies.get(window.__C.K_TOKEN)
}

export function setToken(token) {
  Cookies.set(window.__C.K_TOKEN, `Bearer ${token}`)
}

export function removeToken() {
  Cookies.remove(window.__C.K_TOKEN)
}

export const HeaderToken = { Authorization: getToken() }
