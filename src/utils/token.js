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

export function fixToken() {
  const token = getToken()
  if (token) {
    if (token.indexOf('Bearer ') === -1) {
      // 单点登录模式下, 或者多客户端情况下
      setToken(token)
    }
  }
}
export const HeaderToken = { Authorization: getToken() }
