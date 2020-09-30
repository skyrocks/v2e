<template>
  <el-form :model="formData" :rules="rules" ref="form">
    <el-form-item label="旧密码" prop="oldPwd" v-if="me">
      <el-input type="password" v-model="formData.oldPwd" autocomplete="off"></el-input>
    </el-form-item>
    <el-form-item label="新密码" prop="newPwd">
      <el-input type="password" v-model="formData.newPwd" autocomplete="off"></el-input>
    </el-form-item>
    <el-form-item label="确认密码" prop="checkPwd">
      <el-input type="password" v-model="formData.checkPwd" autocomplete="off"></el-input>
    </el-form-item>
    <el-form-item>
      <default-button type="default" @click="onClose">
        {{ me ? '重 置' : '取 消' }}
      </default-button>
      <default-button @click="onSave">保 存</default-button>
    </el-form-item>
  </el-form>
</template>

<script>
import { updatePwd, updateMyPwd } from '@/api/user'
export default {
  name: 'UserPwdForm',
  props: {
    me: {
      type: Boolean,
      default: true
    }
  },
  data() {
    const validateCheckPwd = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请再次输入新密码'))
      } else if (value !== this.formData.newPwd) {
        callback(new Error('两次输入密码不一致!'))
      } else {
        callback()
      }
    }
    return {
      formData: {
        // 修改密码数据
        newPwd: '',
        checkPwd: '',
        oldPwd: ''
      },
      rules: {
        oldPwd: [{ required: true, message: '请输入旧密码', trigger: 'blur' }],
        newPwd: [
          { required: true, message: '请输入新密码', trigger: 'blur' },
          {
            pattern: /^(?![a-zA-Z]+$)(?![A-Z0-9]+$)(?![a-z0-9]+$)(?![A-Z\W_]+$)(?![a-z\W_]+$)(?![0-9\W_]+$)[a-zA-Z0-9\W_]{8,16}$/,
            message: '密码为数字，小写字母，大写字母，特殊符号 至少包含三种，长度为8 - 30位'
          }
        ],
        checkPwd: [{ required: true, validator: validateCheckPwd }]
      }
    }
  },
  methods: {
    onSave() {
      if (!this.me) {
        this.formData.oldPwd = '*'
      }
      this.$refs.form.validate(valid => {
        if (valid) {
          if (this.me) {
            updateMyPwd(this.formData.oldPwd, this.formData.newPwd).then(this.callback)
          } else {
            const userIds = this.$parent.$parent.getUserIds()
            updatePwd(userIds, this.formData.newPwd).then(this.callback)
          }
        } else {
          return false
        }
      })
    },
    callback(res) {
      if (res.success) {
        this.$emit('success')
        this.resetForm()
        this.$message.success('密码已经修改成功')
      } else {
        this.$message.error(res.message)
      }
    },
    onClose() {
      this.resetForm()
      this.$emit('close')
    },
    resetForm() {
      this.$refs.form.resetFields()
    }
  }
}
</script>
