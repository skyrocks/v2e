<template>
  <Login v-if="!isCasMode"></Login>
</template>

<script>
import Login from './Login'
export default {
  name: 'LoginIndex',
  components: { Login },
  data() {
    return {
      isCasMode: process.env.VUE_APP_SSO_MODE === 'cas'
    }
  },
  mounted() {
    if (this.isCasMode) {
      window.location.href = `${process.env.VUE_APP_BASE_API}/cas/login`
    }
  },
  activated() {
    if (this.isCasMode) {
      window.location.href = `${process.env.VUE_APP_BASE_API}/cas/login`
    }
  }
}
</script>
