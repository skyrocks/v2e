<!--
 * @Author: shilei
 * @Date: 2020-10-20 12:18:08
 * @LastEditors: shilei
 * @LastEditTime: 2020-10-20 13:18:39
 * @Description: 角色用户添加Gird
 * @FilePath: /aolong-parrot/src/views/role/UserAllGrid.vue
-->
<template>
  <div>
    <grid
      ref="grid"
      :height="600"
      :data="userData"
      :total="total"
      filter-position="left"
      :bbar-column="false"
      :bbar-export="false"
      :bbar-export-all="false"
      :loading="loading"
      @reload="loadUser"
      @selection-change="onSelectionChange"
    >
      <column type="selection"></column>
      <column prop="loginName" label="账号"></column>
      <column prop="userName" label="姓名"></column>
      <column
        prop="userType"
        label="类型"
        :formatter="formatter"
        column-key="userType"
        filter-multiple
        :filters="[
          { text: '学生', value: 1 },
          { text: '教职工', value: 2 },
          { text: '虚拟用户', value: 0 }
        ]"
      ></column>
      <column
        prop="userStatus"
        label="状态"
        :formatter="formatter"
        column-key="userStatus"
        filter-multiple
        :filters="[
          { text: '启用', value: 1 },
          { text: '禁用', value: 0 }
        ]"
      ></column>
      <column prop="expiryDate" label="有效期"></column>
      <column prop="cellphone" label="手机号码"></column>
      <column prop="email" label="邮箱地址"></column>
      <ColumnTemplate label="头像">
        <template slot-scope="scope">
          <el-image
            style="width: 28px; height: 28px; border-radius: 50%;"
            :src="`${photoUrls[scope.row.userId]}`"
            fit="cover"
          ></el-image>
        </template>
      </ColumnTemplate>
    </grid>
    <div slot="footer" class="footer">
      <el-button @click="onClose">返 回</el-button>
      <el-button type="primary" @click="onSelect">
        {{ selection.length > 0 ? `添 加 (${selection.length})` : '添 加' }}
      </el-button>
    </div>
  </div>
</template>

<script>
import { Grid, Column, ColumnTemplate } from '@/components/Grid'
// import { MessageBox } from 'element-ui'
import { findAll, browserPhoto } from '@/api/user'

export default {
  name: 'RoleUserGrid',
  components: { Grid, Column, ColumnTemplate },
  data() {
    return {
      loading: true,
      userData: [],
      total: 0,

      photoUrls: {},
      selection: []
    }
  },
  mounted() {
    this.loadUser({ pageNum: 1, filter: '', sort: '' })
  },
  methods: {
    loadUser(gridParam) {
      findAll({}, gridParam.filter, gridParam.sort, gridParam.pageNum, gridParam.pageSize).then(res => {
        if (res.success) {
          this.userData = res.data.list
          this.total = res.data.total
          // 加载照片信息
          this.userData.forEach(user => {
            if (user.existsPhoto) {
              this.getPhoto(user.userId)
            }
          })
        }
        this.loading = false
      })
    },
    getPhoto(userId) {
      browserPhoto(userId).then(res => {
        this.photoUrls[userId] = URL.createObjectURL(new Blob([res]))
        const { index, row } = this.$refs.grid.getRow('userId', userId)
        // table刷新字段
        this.$refs.grid.updateRow(index, row)
      })
    },
    onSelectionChange(rows) {
      this.selection = rows
    },
    onClose() {
      this.$emit('close')
    },
    onSelect() {
      if (this.selection.length > 0) {
        this.$emit('selected', this.selection)
      } else {
        this.$message.warning('请勾选用户记录')
      }
    },
    reset() {
      this.$refs.grid.$table.clearSelection()
      setTimeout(() => {
        this.$refs.grid.$table.doLayout()
      }, 100)
    },
    formatter(row, column) {
      if (column.property === 'userType') {
        if (row.userType === 1) {
          return '学生'
        } else if (row.userType === 2) {
          return '教职工'
        } else {
          return '虚拟用户'
        }
      } else if (column.property === 'userStatus') {
        if (row.userStatus === 1) {
          return '启用'
        } else {
          return (
            <el-tag size="mini" type="info" effect="dark">
              禁用
            </el-tag>
          )
        }
      } else {
        return row[column.property]
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.footer {
  padding: 10px 20px 20px;
  text-align: right;
  box-sizing: border-box;
}
</style>
