<template>
  <div class="view-wrap">
    <Grid :data="userData" :height="height" :total="total" @selection-change="onSelectRows" @reload="loadUser">
      <template slot="tbar">
        <el-button v-has="'Add'" @click="onAdd">添加</el-button>
        <el-button v-has="'Delete'">删除</el-button>
        <el-button v-has="'Update'">修改</el-button>
      </template>
      <el-table-column type="selection"></el-table-column>
      <el-table-column prop="userCode" label="编号" sortable="custom"></el-table-column>
      <el-table-column prop="userName" label="姓名" sortable="custom"></el-table-column>
      <el-table-column prop="loginName" label="账号" sortable="custom"></el-table-column>
      <el-table-column
        prop="userStatus"
        label="状态"
        sortable="custom"
        :formatter="formatter"
        column-key="userStatus"
        filter-multiple
        :filters="[
          { text: '正常', value: 1 },
          { text: '禁用', value: 0 }
        ]"
      ></el-table-column>
      <el-table-column
        prop="userType"
        label="类型"
        sortable="custom"
        :formatter="formatter"
        column-key="userType"
        filter-multiple
        :filters="[
          { text: '学生', value: 1 },
          { text: '老师', value: 2 },
          { text: '虚拟用户', value: 0 }
        ]"
      ></el-table-column>
      <el-table-column prop="cellphone" label="手机号码" sortable="custom"></el-table-column>
      <el-table-column prop="email" label="邮箱地址" sortable="custom"></el-table-column>
      <el-table-column prop="photo" label="照片" sortable="custom"></el-table-column>
      <el-table-column prop="expiryDate" label="有效期" sortable="custom"></el-table-column>
    </Grid>
  </div>
</template>

<script>
import Base from '../base'
import Grid from '@/components/Grid'
import { getAppHeight } from '@/utils'
import { findAll } from '@/api/user'

export default {
  name: 'User',
  extends: Base,
  components: { Grid },
  data() {
    return {
      userData: [],
      total: 0
    }
  },
  computed: {
    height() {
      return getAppHeight() - 15 //减去.view-wrap
    }
  },
  mounted() {
    this.loadUser({ pageNum: 1, filter: '', sort: '' })
  },
  methods: {
    // eslint-disable-next-line no-undef
    @__log('添加用户')
    onAdd() {
      console.log('')
    },

    loadUser(gridParam) {
      findAll({}, gridParam.filter, gridParam.sort, gridParam.pageNum, gridParam.pageSize).then(res => {
        if (res.success) {
          this.userData = res.data.list
          this.total = res.data.total
        }
      })
    },
    onSelectRows(rows) {
      console.log(rows)
    },
    formatter(row, column) {
      if (column.property === 'userType') {
        if (row.userStatus === 1) {
          return '学生'
        } else if (row.userStatus === 2) {
          return '老师'
        } else {
          return '虚拟用户'
        }
      } else if (column.property === 'userStatus') {
        if (row.userStatus === 1) {
          return '正常'
        } else {
          return '禁用'
        }
      } else {
        return row[column.property]
      }
    }
  }
}
</script>
