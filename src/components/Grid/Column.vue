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
    v-if="showColumn"
  ></el-table-column>
</template>
<script>
export default {
  name: 'GridColumn',
  props: {
    type: String,
    prop: String,
    label: String,
    sortable: {
      type: String,
      default: () => 'custom' //默认远程排序
    },
    formatter: Function,
    columnKey: String,
    filterMultiple: Boolean,
    filters: Array
  },
  data() {
    return {
      showColumn: true
    }
  },
  methods: {
    show(val) {
      this.showColumn = val
    }
  }
}
</script>
