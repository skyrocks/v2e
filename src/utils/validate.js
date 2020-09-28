/**
 * @param {string} path
 * @returns {Boolean}
 */
export function isExternal(path) {
  return /^(https?:|mailto:|tel:)/.test(path)
}

// 手机号码正则表达式
export const regCellphone = /^(13[0-9]|14[579]|15[0-3,5-9]|16[6]|17[0135678]|18[0-9]|19[89])\d{8}$/
/**
 * 验证手机号码
 *
 * @export
 * @param {*} cellphone
 * @returns
 */
export function isCellphone(cellphone) {
  return regCellphone.test(cellphone)
}

// 邮箱地址正则表达式
export const regEmail = /^[a-zA-Z0-9_-]+@[a-zA-Z0-9_-]+(\.[a-zA-Z0-9_-]+)+$/
/**
 * 验证邮箱地址
 *
 * @export
 * @param {*} email
 * @returns
 */
export function isEmail(email) {
  return regEmail.test(email)
}
