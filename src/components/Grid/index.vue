<!--
基于element.table封装Grid, 重要集成分页组件, 如没有分页需求建议使用原生组件
属性 data, height, highlightCurrentRow, stripe, pagination, pageSize, total, filterPosition, 
    rowClassName, showSummary, sumText, summaryMethod, spanMethod
    如果设置row-class-name属性stripe需要设置成false
事件 current-row-change, selection-change
    size-change
    current-page-change
    filter-change
    sort-change
    reload //以上几个查询数据相关的事件如果没有绑定,就会统一触法reload事件, 
      以上事件触法的参数都是一样的 {pageSize, pageNum, sort, filter}
插槽 default el-table-column
    tbar 顶部工具栏, float=left, 与filter在同一行, 如果不显示filter的情况下也可以不使用此插槽
    bbar 底边工具栏, float=right, 与pagination在同一行
-->
<template>
  <div>
    <div class="tbar">
      <div class="item left">
        <slot name="tbar"></slot>
      </div>
      <div :class="`item ${filterPosition}`" v-if="filterPosition !== 'none'">
        <el-input placeholder="请输入搜索内容..." v-model="filterValue" @change="onCustomFilter">
          <el-select
            :class="`${highlight}`"
            v-model="filterColumn"
            slot="prepend"
            placeholder="请选择"
            :style="`width:${selectSlotWidth}px;`"
          >
            <el-option v-for="item in columns" :key="item.value" :label="item.label" :value="item.value"></el-option>
          </el-select>
        </el-input>
      </div>
    </div>
    <el-table
      ref="grid"
      :data="data"
      :stripe="stripe"
      :height="tableHeight"
      :highlight-current-row="highlightCurrentRow"
      @current-change="onCurrentRowChange"
      @selection-change="onSelectionChange"
      @sort-change="onSortChange"
      @filter-change="onFilterChange"
      :row-class-name="rowClassName"
      :show-summary="showSummary"
      :sum-text="sumText"
      :summary-method="summaryMethod"
      :span-method="spanMethod"
    >
      <slot></slot>
    </el-table>
    <div class="bbar">
      <el-pagination
        class="item left"
        v-if="pagination"
        @size-change="onSizeChange"
        @current-change="onCurrentPageChange"
        :current-page.sync="currentPage"
        :page-sizes="[25, 50, 100, 200, 300, 500, 1000]"
        :page-size="pageSize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
      ></el-pagination>
      <div class="item right" style="padding-top:2px;">
        <slot name="bbar"></slot>
        <el-tooltip class="item" effect="dark" content="显示隐藏列" placement="top-start">
          <el-button icon="el-icon-c-scale-to-original" size="mini" circle></el-button>
        </el-tooltip>
        <el-tooltip class="item" effect="dark" content="下载当前页数据" placement="top">
          <el-button icon="el-icon-download" size="mini" circle></el-button>
        </el-tooltip>
        <el-tooltip class="item" effect="dark" content="下载远程全部数据" placement="top">
          <el-button icon="el-icon-coin" size="mini" circle></el-button>
        </el-tooltip>
        <el-tooltip class="item" effect="dark" content="清除过滤条件" placement="top-end">
          <el-button icon="el-icon-refresh-left" size="mini" circle @click="onClearFilter"></el-button>
        </el-tooltip>
      </div>
    </div>
  </div>
</template>
<script>
import { getStringLength } from '@/utils'

export default {
  name: 'Grid',
  props: {
    data: Array,
    height: Number,
    highlightCurrentRow: {
      type: Boolean,
      default: false
    },
    stripe: {
      type: Boolean,
      default: true
    },
    pagination: {
      type: Boolean,
      default: true
    },
    pageSize: {
      type: Number,
      default: window.__C.P_PAGESIZE
    },
    total: {
      type: Number,
      default: 0
    },
    //table顶部的过滤框属性, left, right, none
    filterPosition: {
      type: String,
      default: 'right'
    },
    rowClassName: Function,
    showSummary: {
      type: Boolean,
      default: false
    },
    sumText: String,
    summaryMethod: Function,
    spanMethod: Function
  },
  computed: {
    tableHeight() {
      let height = this.height
      if (this.pagination) {
        height = height - 42 //42是分页组件的高度
      }
      if (this.filterPosition !== 'none' || this.$slots.tbar !== undefined) {
        height = height - 40 //tbar高度, 如果tbar配置的不是标准的工具条, 可能高度会不正常
      }
      return height
    }
  },
  data() {
    return {
      columns: [],
      filterColumn: '',
      filterValue: '',
      selectSlotWidth: '84', //默认两个字的宽度
      highlight: '', //是否高亮显示内容

      currentPage: 1,
      currentPageSize: undefined,
      currentRow: undefined,
      multipleSelection: undefined,

      $instance: undefined, //当前的实例
      sort: undefined, //排序参数
      filters: {} //表头上的过滤参数
    }
  },
  mounted() {
    this.extractColumnProp()
  },
  methods: {
    extractColumnProp() {
      let $slots = this.$slots.default
      for (let i = 0; i < $slots.length; i++) {
        const c = $slots[i]
        const prop = c.componentOptions.propsData.prop
        if (prop) {
          const l = c.componentOptions.propsData.label
          this.columns.push({ label: l, value: prop })
          //一个字符6个宽度,中文字符表示两个字符, 两边留60的宽度
          if (this.selectSlotWidth < getStringLength(l) * 6 + 60) {
            this.selectSlotWidth = getStringLength(l) * 6 + 60
          }
        }
      }
      this.filterColumn = this.columns[0].value
    },
    onCurrentRowChange(val) {
      this.currentRow = val
      this.$emit('current-row-change', val)
    },
    onSelectionChange(val) {
      this.multipleSelection = val
      this.$emit('selection-change', val)
    },
    onSizeChange(val) {
      this.currentPageSize = val
      this.currentPage = 1
      const params = this.getParams()
      if (this.existsParentListener('size-change')) {
        this.$emit('size-change', params)
      } else {
        this.$emit('reload', params)
      }
    },
    onCurrentPageChange() {
      const params = this.getParams()
      if (this.existsParentListener('current-page-change')) {
        this.$emit('current-page-change', params)
      } else {
        this.$emit('reload', params)
      }
    },
    onFilterChange(val) {
      for (const name in val) {
        this.filters[name] = val[name]
        if (name === this.filterColumn) {
          this.filterValue = ''
          this.highlight = ''
        }
      }
      this.emitFilter()
    },
    onCustomFilter(val) {
      this.highlight = val === '' ? '' : 'grid-select-highlight'
      if (val !== '') {
        for (const filterKey in this.filters) {
          if (filterKey === this.filterColumn) {
            this.$refs.grid.clearFilter(this.filterColumn)
            break
          }
        }
      }
      this.emitFilter()
    },
    onClearFilter() {
      this.$refs.grid.clearFilter()
      this.filters = {}
      this.filterValue = ''
      this.highlight = ''
      this.emitFilter()
    },
    emitFilter() {
      const params = this.getParams()
      if (this.existsParentListener('filter-change')) {
        this.$emit('filter-change', params)
      } else {
        this.$emit('reload', params)
      }
    },
    onSortChange(val) {
      if (val.column.sortable === 'custom') {
        this.sort = val
        const params = this.getParams()
        if (this.existsParentListener('sort-change')) {
          this.$emit('sort-change', params)
        } else {
          this.$emit('reload', params)
        }
      }
    },
    getParams(obj) {
      let filter = {}
      for (const key in this.filters) {
        if (this.filters[key] instanceof Array && this.filters[key].length === 0) {
          delete this.filters[key]
        } else {
          filter[key] = JSON.stringify(this.filters[key])
        }
      }
      if (this.filterValue !== '') {
        filter[this.filterColumn] = this.filterValue
      }
      const params = {
        pageSize: this.currentPageSize || this.pageSize,
        pageNum: this.currentPage,
        sort: this.sort === undefined ? '' : `${this.sort.prop} ${this.sort.order.replace(/ending/, '')}`,
        filter
      }
      if (obj) {
        Object.assign(params, obj)
      }
      return params
    },
    getInstance() {
      if (this.$instance) {
        return this.$instance
      } else {
        const tag = this.$vnode.tag
        const $children = this.$parent.$children
        for (let i = 0; i < $children.length; i++) {
          const $me = $children[i]
          if ($me.$vnode.tag === tag) {
            this.$instance = $me
            break
          }
        }
        return this.$instance
      }
    },
    existsParentListener(eventName) {
      return typeof this.getInstance().$listeners[eventName] === 'function'
    }
  }
}
</script>
<style lang="scss">
.grid-select-highlight .el-input__inner {
  color: #409eff !important;
}
</style>
<style lang="scss" scoped>
.tbar,
.bbar {
  padding: 0 10px;
  &::before,
  &::after {
    display: table;
    content: '';
  }
  .item {
    box-sizing: border-box;
    &.left {
      float: left;
    }
    &.right {
      float: right;
    }
  }
  &::after {
    clear: both;
  }
}
.bbar {
  padding: 5px 10px;
}
</style>
