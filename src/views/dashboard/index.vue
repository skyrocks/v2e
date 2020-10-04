<template>
  <div class="dashboard-container">
    A站
    <div class="dashboard-text">name: {{ name }}</div>

    <svg-icon icon-class="wfxueji" />
    <el-form :model="postForm" :rules="rules">
      <el-form-item prop="title">
        <MDInput v-model="postForm.title" :maxlength="100" name="name" required>
          Title
        </MDInput>
      </el-form-item>
      <el-form-item prop="content">
        <el-input
          v-model="postForm.content"
          :rows="1"
          type="textarea"
          class="article-textarea"
          autosize
          placeholder="Please enter the content"
        />
      </el-form-item>
    </el-form>
    <sticky :sticky-top="50">
      <el-button v-waves type="primary" @click="onRequestTest">Test</el-button>
    </sticky>

    <div v-for="(item, i) in testMenu" :key="i">{{ i }} {{ item }}</div>

    <el-upload :action="uploadAction" :headers="headers" multiple :limit="3" :file-list="fileList">
      <el-button size="small" type="primary">点击上传</el-button>
      <div slot="tip" class="el-upload__tip">只能上传jpg/png文件，且不超过500kb</div>
    </el-upload>

    <el-button type="primary" @click="onDownload">下载</el-button>

    <el-input v-model="testData.input" placeholder="请输入内容"></el-input>
    <el-input type="textarea" v-model="testData.desc"></el-input>
    <el-button type="primary" @click="onTestGet">测试Get</el-button>
    <el-button type="primary" @click="onTestPost">测试Post</el-button>

    <p v-html="$xss(test)"></p>
  </div>
</template>

<script>
import { mixin } from '@/mixin'
import { mapGetters } from 'vuex'
import Sticky from '@/components/Sticky'
import MDInput from '@/components/MDInput'
import { findAuthMenu } from '@/api/menu'
import { getToken } from '@/utils/token'
import clip from '@/utils/clipboard'
import { download, testPost, testGet } from '@/api/user'

export default {
  name: 'Dashboard',
  mixins: [mixin],
  components: { Sticky, MDInput },
  data() {
    const validateRequire = (rule, value, callback) => {
      console.log('validate')
      if (value === '') {
        this.$message({
          message: rule.field + '为必传项',
          type: 'error'
        })
        callback(new Error(rule.field + '为必传项'))
      } else {
        callback()
      }
    }
    return {
      postForm: {
        title: '',
        content: ''
      },

      rules: {
        title: [{ validator: validateRequire }],
        content: [{ validator: validateRequire }]
      },

      testData: {
        input: '',
        desc: ''
      },
      test: `<a onclick='alert("xss攻击")'>链接</a>`,

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
    onTestGet() {
      alert(this.$xss(JSON.stringify(this.testData)))
      testGet(this.testData)
    },
    onTestPost() {
      testPost(this.testData)
    },

    @window.__log('查询菜单测试')
    onRequestTest(e) {
      findAuthMenu().then(response => {
        this.testMenu.push(response.success)
      })
      clip('aaa', e)
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
.article-textarea ::v-deep {
  textarea {
    padding-right: 40px;
    resize: none;
    border: none;
    border-radius: 0px;
    border-bottom: 1px solid #bfcbd9;
  }
}
</style>
