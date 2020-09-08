<template>
  <div class="view-wrap">
    <grid :data="userData" :height="height" :total="total" @selection-change="onSelectRows" @reload="loadUser">
      <template slot="tbar">
        <el-button-group>
          <default-button has="Add" svg-icon="wfrenwu">激活</default-button>
          <default-button has="Add" el-icon="search">禁用</default-button>
          <default-button has="Add" svg-icon="wfrenwu">修改密码</default-button>
          <default-button has="Add" svg-icon="wfrenwu">修改有效期</default-button>
          <default-button has="Add" svg-icon="wfrenwu" @click="onAdd">添加虚拟账号</default-button>
          <default-button has="Add" svg-icon="wfrenwu">删除虚拟账号</default-button>
        </el-button-group>
      </template>
      <column type="selection"></column>
      <column prop="userCode" label="编号"></column>
      <column prop="userName" label="姓名"></column>
      <column prop="loginName" label="账号"></column>
      <column
        prop="userStatus"
        label="状态"
        :formatter="formatter"
        column-key="userStatus"
        filter-multiple
        :filters="[
          { text: '正常', value: 1 },
          { text: '禁用', value: 0 }
        ]"
      ></column>
      <column
        prop="userType"
        label="类型"
        :formatter="formatter"
        column-key="userType"
        filter-multiple
        :filters="[
          { text: '学生', value: 1 },
          { text: '老师', value: 2 },
          { text: '虚拟用户', value: 0 }
        ]"
      ></column>
      <column prop="cellphone" label="手机号码"></column>
      <column prop="email" label="邮箱地址"></column>
      <column prop="photo" label="照片"></column>
      <column prop="expiryDate" label="有效期"></column>
    </grid>
  </div>
</template>

<script>
import Base from '../base'
import { Grid, Column } from '@/components/Grid'
import { getAppHeight } from '@/utils'
import { findAll } from '@/api/user'

export default {
  name: 'User',
  extends: Base,
  components: { Grid, Column },
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
      console.log('onAdd')
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
