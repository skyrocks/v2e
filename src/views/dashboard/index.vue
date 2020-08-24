<template>
  <div class="dashboard-container">
    <div class="dashboard-text">name: {{ name }}</div>

    <svg-icon icon-class="wfxueji" />

    <el-button type="primary" @click="onRequestTest">Test</el-button>

    <div v-for="(item, i) in testMenu" :key="i">{{ i }} {{ item }}</div>
  </div>
</template>

<script>
import Base from '../base'
import { mapGetters } from 'vuex'
import { findAuthMenu } from '@/api/menu'
import { log } from '@/utils/log'

export default {
  name: 'Dashboard',
  extends: Base,
  data() {
    return {
      testMenu: []
    }
  },
  computed: {
    ...mapGetters(['name'])
  },

  methods: {
    @log('查询菜单测试', this)
    onRequestTest() {
      findAuthMenu().then(response => {
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
