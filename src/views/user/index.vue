<template>
  <div class="view-wrap">
    <grid ref="grid" :data="userData" :total="total" @reload="loadUser" :loading="loading">
      <template slot="tbar">
        <el-button-group>
          <default-button class="enable" has="Enable" el-icon="unlock" @click="() => this.updateStatus(1)">
            激活
          </default-button>
          <default-button class="disable" has="Disable" el-icon="lock" @click="() => this.updateStatus(0)">
            禁用
          </default-button>
          <default-button
            class="editPwd"
            has="EditPwd"
            el-icon="edit-outline"
            @click="
              () => {
                getUserIds()
                if (checkUserIds.length > 0) dialogEditPwd = true
              }
            "
          >
            修改密码
          </default-button>
          <default-button
            class="editExpiry"
            has="EditExpiry"
            el-icon="edit"
            @click="
              () => {
                getUserIds()
                dialogEditExpiry = checkUserIds.length > 0
              }
            "
          >
            修改有效期
          </default-button>
          <default-button
            class="add"
            has="Add"
            el-icon="circle-plus-outline"
            @click="
              () => {
                currentUser = ''
                dialogUserForm = true
              }
            "
          >
            添加虚拟账号
          </default-button>
          <default-button class="remove" has="Remove" el-icon="remove-outline" @click="onRemove">
            删除虚拟账号
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
          { text: '正常', value: 1 },
          { text: '禁用', value: 0 }
        ]"
      ></column>
      <column prop="expiryDate" label="有效期"></column>
      <column prop="cellphone" label="手机号码"></column>
      <column prop="email" label="邮箱地址"></column>
      <ColumnTemplate label="头像">
        <template slot-scope="scope">
          <el-popover trigger="hover" placement="left" v-if="scope.row.existsPhoto">
            <el-image
              style="width: 150px; height: 150px"
              :src="`${photoUrls[scope.row.userId]}`"
              fit="cover"
            ></el-image>
            <div style="text-align:center;margin-top:5px;">
              <el-upload
                :action="`${uploadPhotoAction}${scope.row.userId}`"
                :headers="headers"
                :show-file-list="false"
                :before-upload="onBeforeUpPhoto"
                :on-success="(res, file, fileList) => onSuccessUpPhoto(res, file, fileList, scope.row.userId)"
                accept="image/png,image/jpg,image/jpeg"
              >
                <el-button icon="el-icon-upload2" size="mini">更换头像</el-button>
              </el-upload>
            </div>
            <div slot="reference">
              <el-image
                style="width: 28px; height: 28px; border-radius: 50%;"
                :src="`${photoUrls[scope.row.userId]}`"
                fit="cover"
              ></el-image>
            </div>
          </el-popover>
          <el-upload
            v-if="!scope.row.existsPhoto"
            :action="`${uploadPhotoAction}${scope.row.userId}`"
            :headers="headers"
            :show-file-list="false"
            :before-upload="onBeforeUpPhoto"
            :on-success="(res, file, fileList) => onSuccessUpPhoto(res, file, fileList, scope.row.userId)"
            accept="image/png,image/jpg,image/jpeg"
          >
            <el-tooltip content="上传头像" placement="top">
              <el-button icon="el-icon-upload2" circle size="mini"></el-button>
            </el-tooltip>
          </el-upload>
        </template>
      </ColumnTemplate>
      <ColumnTemplate label="角色">
        <template slot-scope="scope">
          <el-popover trigger="hover" placement="left" v-if="scope.row.roles.length > 0">
            <div class="role-tag-wrap">
              <el-tag
                class="role-tag"
                :key="i"
                v-for="(r, i) in scope.row.roles"
                closable
                :disable-transitions="true"
                @close="onRemoveRole(scope.row, r.roleId, i)"
              >
                {{ r.roleName }}
              </el-tag>
            </div>
            <div class="role-tag">
              <el-button
                size="mini"
                @click="
                  () => {
                    currentUser = scope.row
                    dialogRole = true
                  }
                "
              >
                + 添加角色
              </el-button>
            </div>
            <div slot="reference" class="row-wrap">
              <span v-if="scope.row.roles.length > 1">{{ scope.row.roles.length }} 个角色</span>
              <span v-if="scope.row.roles.length === 1">{{ scope.row.roles[0].roleName }}</span>
            </div>
          </el-popover>
          <el-button
            v-if="scope.row.roles.length === 0"
            size="mini"
            @click="
              () => {
                currentUser = scope.row
                dialogRole = true
              }
            "
          >
            + 添加角色
          </el-button>
        </template>
      </ColumnTemplate>
      <ColumnTemplate label="操作">
        <template slot-scope="scope">
          <el-button
            size="mini"
            icon="el-icon-edit"
            @click="
              () => {
                currentUser = scope.row
                dialogUserForm = true
              }
            "
          >
            编辑
          </el-button>
        </template>
      </ColumnTemplate>
    </grid>
    <el-dialog :visible.sync="dialogEditPwd" width="30%" :close-on-click-modal="false">
      <template slot="title">
        <span class="dialog-title">
          您正在修改
          <span class="count">{{ checkUserIds.length }}</span>
          个用户的密码
        </span>
      </template>
      <PwdForm :me="false" @close="dialogEditPwd = false" @success="dialogEditPwd = false"></PwdForm>
    </el-dialog>
    <el-dialog :visible.sync="dialogEditExpiry" width="30%" :close-on-click-modal="false">
      <template slot="title">
        <span class="dialog-title">
          您正在修改
          <span class="count">{{ checkUserIds.length }}</span>
          个用户的有效期
        </span>
      </template>
      <ExpiryForm @close="dialogEditExpiry = false" @success="onEditExpirySuccess"></ExpiryForm>
    </el-dialog>
    <el-dialog
      :visible.sync="dialogUserForm"
      width="40%"
      :close-on-click-modal="false"
      @open="
        () => {
          if ($refs.userForm) {
            $refs.userForm.setUser(currentUser)
          }
        }
      "
      @opened="
        () => {
          // 第一次打开的时候由于没有渲染完成, $refs.userForm=undefined, 所以需要在opened事件中调用,
          // 也就是说这个事件只在一次打开的时候有用, 再次打开的时候open就够了, 所以这里两个事件的写法有些偷懒, 可以用一个全局变量来判断
          // 之所以不直接使用opened, 是因为打开后页面渲染会有延时, 体检不佳
          $refs.userForm.setUser(currentUser)
        }
      "
    >
      <template slot="title">
        <span class="dialog-title">
          <span v-if="currentUser === ''">创建虚拟账号</span>
          <span v-if="currentUser !== ''">
            修改账号
            <span v-if="currentUser.userType === 0" class="account-type">(虚拟账号)</span>
            <span v-if="currentUser.userType === 1" class="account-type">(学生账号, 只允许修改有效期和状态)</span>
            <span v-if="currentUser.userType === 2" class="account-type">(教职工账号, 只允许修改有效期和状态)</span>
          </span>
        </span>
      </template>
      <UserForm
        ref="userForm"
        @close="dialogUserForm = false"
        :edit-user="currentUser"
        @success="onCreateSuccess"
      ></UserForm>
    </el-dialog>
    <RoleDialog :visible="dialogRole" @close="dialogRole = false" @selected="onAddRole"></RoleDialog>
  </div>
</template>

<script>
import { mixin } from '@/mixin'
import { guide } from './guide'
import { MessageBox } from 'element-ui'
import { concatUnique } from '@/utils'
import { Grid, Column, ColumnTemplate } from '@/components/Grid'
import { findAll, remove, updateStatus, addRoles, removeRole, browserPhoto } from '@/api/user'
import { HeaderToken } from '@/utils/token'
import UserForm from './UserForm'
import PwdForm from './PwdForm'
import ExpiryForm from './ExpiryForm'
import RoleDialog from '../role/Dialog'

export default {
  name: 'User',
  mixins: [guide, mixin],
  components: { Grid, Column, ColumnTemplate, RoleDialog, UserForm, PwdForm, ExpiryForm },
  data() {
    return {
      loading: true,
      userData: [],
      total: 0,

      checkUserIds: [], //勾选的用户ID, 用于用户修改
      currentUser: '', //当前选中的用户记录, 用于添加角色 或者 编辑

      dialogUserForm: false, //创建虚拟账号的窗口标识

      dialogEditPwd: false, // 修改密码打开窗口标识
      dialogEditExpiry: false, // 修改有效期窗口标识

      dialogRole: false, // 角色选择窗口标识

      photoUrls: {}, //照片地址 userId:url
      uploadPhotoAction: `${process.env.VUE_APP_BASE_API}/api/users/photo/`,
      headers: HeaderToken
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
          //加载照片信息
          this.userData.forEach(user => {
            if (user.existsPhoto) {
              this.getPhoto(user.userId)
            }
          })
        }
        this.loading = false
      })
    },
    onRemove() {
      const ids = this.getUserIds()
      if (ids.length === 0) {
        return
      }
      MessageBox.confirm('确定要删除吗?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        remove(this.getUserIds()).then(res => {
          if (res.success) {
            this.loadUser(this.$refs.grid.currentParams)
          }
        })
      })
    },
    updateStatus(status) {
      const ids = this.getUserIds()
      if (ids.length === 0) {
        return
      }
      const { indexs, rows } = this.$refs.grid.getRows('userId')
      updateStatus(this.getUserIds(), status).then(res => {
        if (res.success) {
          indexs.forEach((item, i) => {
            const rowClone = JSON.parse(JSON.stringify(rows[i]))
            rowClone.userStatus = status
            this.$refs.grid.updateRow(item, rowClone)
          })
          this.$message.success(status === 1 ? '用户账号已激活' : '用户账号已禁用')
        } else {
          this.$message.error(res.message)
        }
      })
    },
    onAddRole(roles) {
      this.dialogRole = false
      let roleIds = []
      roles.forEach(r => {
        roleIds.push(r.roleId)
      })
      addRoles(this.currentUser.userId, roleIds).then(res => {
        if (res.success) {
          this.currentUser.roles = concatUnique(this.currentUser.roles, roles, 'roleId')
        } else {
          this.$message.error(res.message)
        }
      })
    },
    onRemoveRole(row, roleId, index) {
      removeRole(row.userId, roleId).then(res => {
        if (res.success) {
          row.roles.splice(index, 1)
        } else {
          this.$message.error(res.message)
        }
      })
    },
    onEditExpirySuccess(date) {
      const { indexs, rows } = this.$refs.grid.getRows('userId')
      indexs.forEach((item, i) => {
        const rowClone = JSON.parse(JSON.stringify(rows[i]))
        rowClone.expiryDate = date
        this.$refs.grid.updateRow(item, rowClone)
      })
      this.dialogEditExpiry = false
    },
    onCreateSuccess(formData) {
      this.dialogUserForm = false
      console.log(formData)
      if (formData === '') {
        // 新增
        this.loadUser(this.$refs.grid.currentParams)
      } else {
        // 修改
        const { index } = this.$refs.grid.getRow('userId', this.currentUser.userId)
        const rowClone = JSON.parse(JSON.stringify(this.currentUser))
        rowClone.expiryDate = formData.expiryDate
        rowClone.userStatus = formData.userStatus
        console.log(rowClone)
        this.$refs.grid.updateRow(index, rowClone)
      }
    },
    onSuccessUpPhoto(res, file, fileList, userId) {
      this.photoUrls[userId] = URL.createObjectURL(file.raw)
      const { index, row } = this.$refs.grid.getRow('userId', userId)
      //table刷新字段
      row.existsPhoto = true
      this.$refs.grid.updateRow(index, row)
    },
    onBeforeUpPhoto(file) {
      const isPicture = file.type === 'image/jpeg' || file.type === 'image/jpg' || file.type === 'image/png'
      const isLt1M = file.size / 1024 / 1024 < 5
      if (!isPicture) {
        this.$message.error('上传头像图片只能是 JPG, JPEG, PNG 格式!')
      }
      if (!isLt1M) {
        this.$message.error('上传头像图片大小不能超过 1MB!')
      }
      return isPicture && isLt1M
    },
    getPhoto(userId) {
      browserPhoto(userId).then(res => {
        this.photoUrls[userId] = URL.createObjectURL(new Blob([res]))
        const { index, row } = this.$refs.grid.getRow('userId', userId)
        //table刷新字段
        this.$refs.grid.updateRow(index, row)
      })
    },
    getUserIds() {
      const rows = this.$refs.grid.$table.selection
      this.checkUserIds = []
      for (let i = 0; i < rows.length; i++) {
        this.checkUserIds.push(rows[i].userId)
      }
      return this.checkUserIds
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
.role-tag-wrap {
  max-width: 400px;
}
.row-wrap {
  color: $color-font-blue;
}
.role-tag {
  margin: 5px 3px;
}
.dialog-title {
  line-height: 24px;
  font-size: $size-font-larger;
  color: $color-font-black;
  .count,
  .account-type {
    color: $color-font-red;
    font-weight: bold;
  }
}
</style>
