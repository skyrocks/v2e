<template>
  <el-table-column
    :type="type"
    :prop="prop"
    :label="label"
    :formatter="formatter"
    :column-key="columnKey"
    :filter-multiple="filterMultiple"
    :filters="filters"
    :sortable="sortable"
    :show-overflow-tooltip="true"
    v-if="showColumn"
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
  props: {
    sortable: {
      default: () => false //默认不排序
    },
    filterBar: {
      type: Boolean,
      default: () => false //是否加载到头部的下来过滤组件内
    }
  },
  mixins: [mixin]
}
</script>
