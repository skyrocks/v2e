<template>
  <div>
    <el-form
      v-show="!dialogRole"
      :model="formData"
      :rules="rules"
      label-width="80px"
      ref="form"
      style="margin-right:30px;"
    >
      <el-form-item label="账号" prop="loginName">
        <el-input v-model="formData.loginName" autocomplete="off" :disabled="!isVirtualAccount"></el-input>
      </el-form-item>
      <el-form-item label="姓名" prop="userName">
        <el-input v-model="formData.userName" autocomplete="off" :disabled="!isVirtualAccount"></el-input>
      </el-form-item>
      <el-form-item label="密码" prop="password" v-if="isCreate">
        <el-input type="password" v-model="formData.password" autocomplete="off"></el-input>
      </el-form-item>
      <el-form-item label="手机号码" prop="cellphone">
        <el-input v-model="formData.cellphone" autocomplete="off" :disabled="!isVirtualAccount"></el-input>
      </el-form-item>
      <el-form-item label="邮箱地址" prop="email">
        <el-input v-model="formData.email" autocomplete="off" :disabled="!isVirtualAccount"></el-input>
      </el-form-item>
      <el-form-item label="有效期" prop="expiryDate">
        <el-date-picker
          type="date"
          v-model="formData.expiryDate"
          value-format="yyyy-MM-dd"
          style="width: 100%;"
          :picker-options="pickerOptions"
        ></el-date-picker>
      </el-form-item>
      <el-form-item label="状态" prop="userStatus" v-if="!isCreate">
        <el-switch v-model="formData.userStatus" :active-value="1" :inactive-value="0"></el-switch>
      </el-form-item>
      <el-form-item label="角色" v-if="isCreate">
        <div>
          <el-tag
            style="margin-right: 5px;"
            :key="i"
            v-for="(r, i) in roles"
            closable
            :disable-transitions="true"
            @close="onRemoveRole(i)"
          >
            {{ r.roleName }}
          </el-tag>
        </div>
        <el-button size="small" @click="onOpenRoleGrid">
          + 添加角色
        </el-button>
      </el-form-item>
      <el-form-item>
        <default-button type="default" @click="onClose">取 消</default-button>
        <default-button @click="isCreate ? onCreate() : onSave()">
          {{ isCreate ? '创 建' : '保 存' }}
        </default-button>
      </el-form-item>
    </el-form>
    <div class="role-wrap" v-show="dialogRole">
      <RoleGrid ref="rolegrid" :height="500" @close="dialogRole = false" @selected="onAddRole"></RoleGrid>
    </div>
  </div>
</template>

<script>
import { isCellphone, isEmail } from '@/utils/validate'
import { concatUnique } from '@/utils'
import moment from 'moment'
import RoleGrid from '../role/Grid'
import { create, update, validate } from '@/api/user'

export default {
  name: 'UserForm',
  components: { RoleGrid },
  data() {
    const validateLoginNameExists = (rule, loginName, callback) => {
      if (loginName === '') {
        callback(new Error('请输入账号'))
      } else {
        validate('loginName', loginName, this.isCreate ? '' : this.formData.userId).then(res => {
          if (res.success) {
            if (res.data) {
              callback(new Error('账号已存在'))
            } else {
              callback()
            }
          }
        })
      }
    }
    const validateCellphoneExists = (rule, value, callback) => {
      if (value !== '') {
        if (!isCellphone(value)) {
          callback(new Error('请输入有效手机号码'))
        } else {
          validate('cellphone', value, this.isCreate ? '' : this.formData.userId).then(res => {
            if (res.success) {
              if (res.data) {
                callback(new Error('手机号码已存在'))
              } else {
                callback()
              }
            }
          })
        }
      } else {
        callback()
      }
    }
    const validateEmailExists = (rule, value, callback) => {
      if (value !== '') {
        if (!isEmail(value)) {
          callback(new Error('请输入邮箱地址'))
        } else {
          validate('email', value, this.isCreate ? '' : this.formData.userId).then(res => {
            if (res.success) {
              if (res.data) {
                callback(new Error('邮箱地址已存在'))
              } else {
                callback()
              }
            }
          })
        }
      } else {
        callback()
      }
    }
    return {
      formData: {},
      rules: {
        userName: [{ required: true, message: '请输入姓名' }],
        loginName: [{ required: true, validator: validateLoginNameExists }],
        password: [
          { required: true, message: '请输入密码' },
          {
            pattern: /^(?![a-zA-Z]+$)(?![A-Z0-9]+$)(?![a-z0-9]+$)(?![A-Z\W_]+$)(?![a-z\W_]+$)(?![0-9\W_]+$)[a-zA-Z0-9\W_]{8,16}$/,
            message: '密码为数字，小写字母，大写字母，特殊符号 至少包含三种，长度为8 - 30位'
          }
        ],
        cellphone: [{ validator: validateCellphoneExists }],
        email: [{ validator: validateEmailExists }]
      },
      pickerOptions: {
        disabledDate(time) {
          return moment()
            .add(-1, 'd')
            .isAfter(time)
        }
      },

      dialogRole: false,
      roles: [],

      isCreate: true, //添加
      isVirtualAccount: true //虚拟账号
    }
  },
  methods: {
    setUser(user) {
      if (user) {
        this.formData = JSON.parse(JSON.stringify(user))
        this.isCreate = false
        this.isVirtualAccount = this.formData.userType === 0
      } else {
        this.formData = {
          userName: '',
          loginName: '',
          password: '',
          cellphone: '',
          email: '',
          expiryDate: '',
          userStatus: 1,
          userType: 0
        }
        this.isCreate = true
        this.isVirtualAccount = true
      }
      this.$nextTick(() => {
        this.$refs.form.clearValidate()
      })
    },
    onCreate() {
      this.$refs.form.validate(valid => {
        if (valid) {
          this.formData.roles = this.roles
          create(this.formData).then(res => {
            if (res.success) {
              this.resetForm()
              this.$emit('success', '')
              this.$message.success('新账号已经创建成功')
            } else {
              this.$message.error(res.message)
            }
          })
        } else {
          return false
        }
      })
    },
    onSave() {
      update(this.formData).then(res => {
        if (res.success) {
          this.$emit('success', this.formData)
          this.resetForm()
          this.$message.success('账号信息已经修改成功')
        } else {
          this.$message.error(res.message)
        }
      })
    },
    onOpenRoleGrid() {
      this.dialogRole = true
      setTimeout(() => {
        this.$refs.rolegrid.doLayout()
      }, 200)
    },
    onAddRole(rows) {
      this.roles = concatUnique(this.roles, rows, 'roleId')
      this.dialogRole = false
    },
    onRemoveRole(i) {
      this.roles.splice(i, 1)
    },
    onClose() {
      this.resetForm()
      this.$emit('close')
    },
    resetForm() {
      this.roles.length = 0
      this.$refs.form.resetFields()
      this.$refs.form.clearValidate()
    }
  }
}
</script>

<style lang="scss" scoped>
.role-wrap {
  margin: 15px 0;
}
</style>
