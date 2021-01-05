<!--
 * @Author: shilei
 * @Date: 2020-09-07 09:44:58
 * @LastEditors: shilei
 * @LastEditTime: 2020-10-27 16:12:02
 * @Description: 这是一个什么文件...
 * @FilePath: /aolong-parrot/src/components/Grid/Column.vue
-->
<template>
  <el-table-column
    v-if="showColumn && isHas"
    :type="type"
    :prop="prop"
    :label="label"
    :formatter="formatter"
    :column-key="columnKey"
    :filter-multiple="filterMultiple"
    :filters="filters"
    :sortable="sortable"
    :show-overflow-tooltip="true"
    :class-name="className"
  ></el-table-column>
</template>
<script>
import mixin from './mixin'
export default {
  name: 'GridColumn',
  mixins: [mixin]
}
</script>
