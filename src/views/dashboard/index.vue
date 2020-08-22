<template>
  <div class="dashboard-container">
    <div class="dashboard-text">name: {{ name }}</div>

    <svg-icon icon-class="wfxueji" />

    <el-button type="primary" @click="onRequestTest">Test</el-button>

    <div v-for="(item, i) in testMenu" :key="i">{{ i }} {{ item }}</div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import { findAuthMenu } from '@/api/menu'

export default {
  name: 'Dashboard',
  data() {
    return {
      testMenu: []
    }
  },
  computed: {
    ...mapGetters(['name'])
  },
  methods: {
    onRequestTest() {
      findAuthMenu().then(response => {
        console.log(response)
        this.testMenu.push(response.success)
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.dashboard {
  &-container {
    margin: 30px;
  }
  &-text {
    font-size: 30px;
    line-height: 46px;
  }
}
</style>
