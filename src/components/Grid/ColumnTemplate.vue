<!--
 * @Author: shilei
 * @Date: 2020-09-22 15:59:10
 * @LastEditors: shilei
 * @LastEditTime: 2020-10-27 16:05:28
 * @Description: 这是一个什么文件...
 * @FilePath: /aolong-parrot/src/components/Grid/ColumnTemplate.vue
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
  >
    <template slot-scope="scope">
      <slot :row="scope.row"></slot>
    </template>
  </el-table-column>
</template>
<script>
import mixin from './mixin'
export default {
  name: 'GridColumnTemplate',
  mixins: [mixin],
  props: {
    sortable: {
      default: () => false // 默认不排序
    },
    filterBar: {
      type: Boolean,
      default: () => false // 是否加载到头部的下来过滤组件内
    }
  }
}
</script>
