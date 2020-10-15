<!--
 * @Author: shilei
 * @Date: 2020-09-25 11:29:07
 * @LastEditors: shilei
 * @LastEditTime: 2020-10-15 15:15:59
 * @Description: 这是一个什么文件...
 * @FilePath: /aolong-parrot/src/views/user/ExpiryForm.vue
-->
<template>
  <el-form ref="form" :model="formData" :rules="rules">
    <el-form-item label="截止有效日期" prop="date">
      <el-date-picker
        v-model="formData.date"
        type="date"
        value-format="yyyy-MM-dd"
        style="width: 100%;"
        :picker-options="pickerOptions"
      ></el-date-picker>
    </el-form-item>
    <el-form-item>
      <default-button type="default" @click="onClose">取 消</default-button>
      <default-button @click="onSave">保 存</default-button>
    </el-form-item>
  </el-form>
</template>

<script>
import dayjs from 'dayjs'
import { updateExpiry } from '@/api/user'
export default {
  name: 'UserExpiryFrom',
  props: {
    userIds: {
      type: Array,
      require: true,
      default: () => []
    }
  },
  data() {
    return {
      formData: { date: '' },
      rules: { date: [{ required: true, message: '请输入有效日期' }] },
      pickerOptions: {
        disabledDate(time) {
          return dayjs()
            .add(-1, 'day')
            .isAfter(time)
        }
      }
    }
  },
  methods: {
    onSave() {
      this.$refs.form.validate(valid => {
        if (valid) {
          updateExpiry(this.$parent.$parent.getUserIds(), this.formData.date).then(res => {
            if (res.success) {
              this.$emit('success', this.formData.date)
              this.resetForm()
              this.$message.success('有效期已经修改成功')
            } else {
              this.$message.error(res.message)
            }
          })
        } else {
          return false
        }
      })
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
