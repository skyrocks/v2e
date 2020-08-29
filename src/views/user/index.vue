<template>
  <div>
    <el-button v-has="'Add'" @click="onAdd">添加</el-button>
    <el-button v-has="'Delete'">删除</el-button>
    <el-button v-has="'Update'">修改</el-button>
  </div>
</template>

<script>
import Base from '../base'

export default {
  name: 'User',
  extends: Base,
  methods: {
    // eslint-disable-next-line no-undef
    @__log('添加用户')
    onAdd() {
      console.log('')
    }
  }
}
</script>
