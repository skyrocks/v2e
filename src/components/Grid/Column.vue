<template>
  <el-table-column
    v-if="showColumn"
    :type="type"
    :prop="prop"
    :label="label"
    :formatter="formatter"
    :column-key="columnKey"
    :filter-multiple="filterMultiple"
    :filters="filters"
    :sortable="sortable"
    :show-overflow-tooltip="true"
  ></el-table-column>
</template>
<script>
import mixin from './mixin'
export default {
  name: 'GridColumn',
  mixins: [mixin]
}
</script>
