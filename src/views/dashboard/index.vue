<template>
  <div class="dashboard-container">
    <div class="dashboard-text">name: {{ name }}</div>

    <svg-icon icon-class="wfxueji" />

    <el-button type="primary" @click="onRequestTest">Test</el-button>

    <div v-for="(item, i) in testMenu" :key="i">{{ i }} {{ item }}</div>

    <el-upload :action="uploadAction" :headers="headers" multiple :limit="3" :file-list="fileList">
      <el-button size="small" type="primary">点击上传</el-button>
      <div slot="tip" class="el-upload__tip">只能上传jpg/png文件，且不超过500kb</div>
    </el-upload>

    <el-button type="primary" @click="onDownload">下载</el-button>
  </div>
</template>

<script>
import Base from '../base'
import { mapGetters } from 'vuex'
import { findAuthMenu } from '@/api/menu'
import { getToken } from '@/utils/token'
import { download } from '@/api/user'

export default {
  name: 'Dashboard',
  extends: Base,
  data() {
    return {
      testMenu: [],
      fileList: [],
      uploadAction: `${process.env.VUE_APP_BASE_API}/api/users/upload`,
      headers: { Authorization: `${getToken()}` }
    }
  },
  computed: {
    ...mapGetters(['name'])
  },
  methods: {
    @window.__log('查询菜单测试')
    onRequestTest() {
      findAuthMenu().then(response => {
        this.testMenu.push(response.success)
      })
    },

    onDownload() {
      download()
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
