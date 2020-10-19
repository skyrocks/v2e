<!--
 * @Author: shilei
 * @Date: 2020-09-07 16:10:50
 * @LastEditors: shilei
 * @LastEditTime: 2020-10-19 15:11:27
 * @Description: 封装按钮组件
 * @FilePath: /aolong-parrot/src/components/Button/Default.vue
-->
<template>
  <el-button v-waves v-has="has" size="medium" :type="type" :icon="`el-icon-${elIcon}`" @click="onClick">
    <svg-icon v-if="svgIcon !== undefined && svgIcon !== ''" :icon-class="svgIcon" class="svg" />
    <slot></slot>
  </el-button>
</template>
<script>
export default {
  name: 'ButtonDefault',
  props: {
    has: String,
    svgIcon: String,
    elIcon: String,
    type: {
      type: String,
      default: 'primary'
    }
  },
  methods: {
    onClick() {
      this.$emit('click')
    }
  }
}
</script>
<style lang="scss" scoped>
.svg {
  margin-right: 5px;
  height: 13.33px;
}
</style>
