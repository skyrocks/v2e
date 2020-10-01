const mixin = {
  beforeCreate() {
    if (process.env.VUE_APP_CAS_URL) {
      // CAS模式, 跳转到CAS后端再重定向
      window.location.href = process.env.VUE_APP_CAS_URL
    }
  }
}

export { mixin }
