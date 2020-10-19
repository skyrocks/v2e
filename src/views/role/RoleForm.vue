<!--
 * @Author: shilei
 * @Date: 2020-10-19 18:18:41
 * @LastEditors: shilei
 * @LastEditTime: 2020-10-19 22:20:55
 * @Description: 角色表单
 * @FilePath: /aolong-parrot/src/views/role/RoleForm.vue
-->
<template>
  <div>
    <el-form ref="form" :model="formData" :rules="rules">
      <el-form-item label="角色名称" prop="roleName">
        <el-input v-model="formData.roleName" autocomplete="off"></el-input>
      </el-form-item>
      <el-form-item label="状态" prop="roleStatus">
        <el-switch v-model="formData.roleStatus" :active-value="1" :inactive-value="0"></el-switch>
      </el-form-item>
      <el-form-item>
        <default-button type="default" @click="onClose">取 消</default-button>
        <default-button @click="onSave">保 存</default-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import { create, update } from '@/api/role'

export default {
  name: 'RoleForm',
  props: {
    data: {
      type: Object,
      required: true
    }
  },
  data() {
    return {
      formData: JSON.parse(JSON.stringify(this.data)), // 作用于第一次打开窗口
      rules: {
        roleName: [{ required: true, message: '请输入角色名称' }]
      }
    }
  },
  watch: {
    data: {
      // 第一次打开窗口时不会执行
      handler(newValue) {
        Object.assign(this.formData, newValue)
        setTimeout(() => {
          //延时执行,否则无效 (先修改一个角色,再添加角色)
          this.$refs.form.clearValidate()
        }, 0)
      },
      deep: true
    }
  },
  methods: {
    onSave() {
      if (this.formData.roleId === '') {
        create(this.formData).then(res => {
          if (res.success) {
            this.$emit('success', this.formData)
            this.$message.success('角色已经创建成功')
          } else {
            this.$message.error(res.message)
          }
        })
      } else {
        update(this.formData).then(res => {
          if (res.success) {
            this.$emit('success', this.formData)
            this.$message.success('角色名称已经修改成功')
          } else {
            this.$message.error(res.message)
          }
        })
      }
    },
    onClose() {
      this.$emit('close')
    }
  }
}
</script>

<style lang="scss" scoped></style>
