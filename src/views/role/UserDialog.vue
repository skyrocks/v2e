<!--
 * @Author: shilei
 * @Date: 2020-10-20 10:32:31
 * @LastEditors: shilei
 * @LastEditTime: 2020-10-20 13:55:03
 * @Description: 角色下的用户记录
 * @FilePath: /aolong-parrot/src/views/role/UserDialog.vue
-->
<template>
  <div>
    <el-dialog
      top="5vh"
      :visible.sync="visibleDialog"
      width="70%"
      :close-on-click-modal="false"
      @close="onClose"
      @opend="onOpen"
    >
      <template slot="title">
        <div class="title">
          <span>[ {{ data.roleName }} ]</span>
          用户记录
        </div>
      </template>
      <div class="grid-wrap">
        <transition name="moveL">
          <grid
            v-show="userGrid"
            ref="grid"
            :height="670"
            :data="userData"
            :total="total"
            :loading="loading"
            @reload="loadUser"
          >
            <template slot="tbar">
              <el-button-group>
                <default-button class="add" has="Add" el-icon="circle-plus-outline" @click="onOpenAddUserGrid">
                  添加角色用户
                </default-button>
                <default-button class="remove" has="Remove" el-icon="delete" @click="onRemove">
                  删除角色用户
                </default-button>
              </el-button-group>
            </template>
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
        </transition>
        <transition name="moveR">
          <UserAllGrid
            v-show="userAllGrid"
            ref="userAllGrid"
            @close="
              () => {
                userAllGrid = false
                userGrid = true
              }
            "
            @selected="onAddUser"
          ></UserAllGrid>
        </transition>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { Grid, Column, ColumnTemplate } from '@/components/Grid'
import { MessageBox } from 'element-ui'
import { findUsers, removeUsers, addUsers } from '@/api/role'
import { browserPhoto } from '@/api/user'
import UserAllGrid from './UserAllGrid'

export default {
  name: 'RoleUserDialog',
  components: { Grid, Column, ColumnTemplate, UserAllGrid },
  props: {
    visible: {
      type: Boolean,
      default: () => false
    },
    data: {
      type: Object,
      required: true
    }
  },
  data() {
    return {
      visibleDialog: false,

      loading: true,
      userData: [],
      total: 0,

      photoUrls: {},

      userGrid: true,
      userAllGrid: false
    }
  },
  watch: {
    visible(val) {
      this.visibleDialog = val
    },
    data: {
      // 第一次打开窗口时不会执行
      handler() {
        this.loadUser({ pageNum: 1, filter: '', sort: '' })
      },
      deep: true
    }
  },
  mounted() {
    this.loadUser({ pageNum: 1, filter: '', sort: '' })
  },
  methods: {
    loadUser(gridParam, updateCount = false) {
      if (this.data.roleId === '') {
        return
      }
      findUsers(this.data.roleId, gridParam.filter, gridParam.sort, gridParam.pageNum, gridParam.pageSize).then(res => {
        if (res.success) {
          this.userData = res.data.list
          this.total = res.data.total
          // 加载照片信息
          this.userData.forEach(user => {
            if (user.existsPhoto) {
              this.getPhoto(user.userId)
            }
          })
          if (updateCount) {
            this.$emit('update', this.total)
          }
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
    onRemove() {
      const ids = this.getIds()
      if (ids.length === 0) {
        return
      }

      MessageBox.confirm('确定要删除当前角色下的用户吗?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          removeUsers(this.data.roleId, ids).then(res => {
            if (res.success) {
              this.loadUser(this.$refs.grid.currentParams, true)
            }
          })
        })
        .catch(() => {})
    },
    getIds() {
      const rows = this.$refs.grid.$table.selection
      let ids = []
      for (let i = 0; i < rows.length; i++) {
        ids.push(rows[i].userId)
      }
      return ids
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
    },
    onOpen() {
      this.$refs.grid.doLayout()
    },
    onOpenAddUserGrid() {
      this.userAllGrid = true
      this.userGrid = false
      this.$refs.userAllGrid.reset()
    },
    onAddUser(users) {
      this.userAllGrid = false
      this.userGrid = true
      const userIds = []
      users.forEach(r => {
        userIds.push(r.userId)
      })
      addUsers(this.data.roleId, userIds).then(res => {
        if (res.success) {
          this.loadUser(this.$refs.grid.currentParams, true)
        } else {
          this.$message.error(res.message)
        }
      })
    },
    onClose() {
      this.$emit('close')
    }
  }
}
</script>

<style lang="scss" scoped>
.title {
  line-height: 24px;
  font-size: 18px;
  span {
    color: $color-font-red;
  }
}

.grid-wrap {
  height: 670px;
  overflow: hidden;
}

.moveR-enter-active,
.moveR-leave-active {
  transition: all 0.3s linear;
}
.moveR-enter,
.moveR-leave {
  opacity: 0.3;
  transform: translateX(50%);
}
.moveR-leave-to {
  opacity: 0.3;
  transform: translateX(50%);
}

.moveL-enter-active,
.moveL-leave-active {
  transition: all 0.3s linear;
}
.moveL-enter,
.moveL-leave {
  opacity: 0.3;
  transform: translateX(-50%);
}
.moveL-leave-to {
  opacity: 0.3;
  transform: translateX(-50%);
}
</style>
