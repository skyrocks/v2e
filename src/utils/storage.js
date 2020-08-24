export default {
  set(key, value) {
    var v = value
    if (typeof v === 'object') {
      v = JSON.stringify(v)
      v = 'obj-' + v
    }
    localStorage.setItem(key, v)
  },
  get(key) {
    const v = localStorage.getItem(key)
    if (!v) return
    if (v.indexOf('obj-') === 0) {
      return JSON.parse(v.slice(4))
    } else {
      return v
    }
  },
  remove(key) {
    if (key) {
      localStorage.removeItem(key)
    }
  }
}
