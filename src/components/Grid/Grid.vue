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
        <el-input placeholder="请输入搜索内容..." v-model="filterValue" @change="onCustomFilter" class="grid-serach">
          <el-select
            :class="`${highlight}`"
            v-model="filterColumn"
            slot="prepend"
            placeholder="请选择"
            :style="`width:${selectSlotWidth}px;`"
          >
            <el-option v-for="item in colsFilter" :key="item.value" :label="item.label" :value="item.value"></el-option>
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
      :border="border"
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
      <template slot="empty">
        <span v-if="loading">
          <i class="el-icon-loading" style="font-size:1.6rem;"></i>
          数据加载中
        </span>
        <span v-else>
          暂无数据
        </span>
      </template>
      <slot></slot>
    </el-table>
    <div class="bbar">
      <el-pagination
        class="item left grid-pagination"
        v-if="pagination"
        @size-change="onSizeChange"
        @current-change="onCurrentPageChange"
        :current-page.sync="currentPage"
        :page-sizes="[25, 50, 100, 200, 300, 500, 1000]"
        :page-size="pageSize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
      ></el-pagination>
      <div class="item right gird-bbar" style="padding-top:2px;">
        <slot name="bbar"></slot>
        <el-popover class="item column" placement="top-end" trigger="hover" v-if="bbarColumn">
          <el-checkbox
            v-model="item.show"
            v-for="item in columns"
            :key="item.value"
            @change="onShowColumn($event, item.value)"
            class="column-checked"
          >
            {{ item.label }}
          </el-checkbox>
          <el-button
            slot="reference"
            icon="el-icon-c-scale-to-original"
            size="mini"
            circle
            :class="`column-btn ${hideCols > 0 ? 'hide-cols' : ''}`"
          ></el-button>
        </el-popover>
        <el-tooltip class="item export" effect="dark" content="下载当前页数据" placement="top" v-if="bbarExport">
          <el-button icon="el-icon-download" size="mini" circle @click="onExport"></el-button>
        </el-tooltip>
        <!-- <el-tooltip class="item exportAll" effect="dark" content="下载远程全部数据" placement="top" v-if="bbarExportAll">
          <el-button icon="el-icon-coin" size="mini" circle @click="onExportFromServer"></el-button>
        </el-tooltip> -->
        <el-tooltip class="item clear" effect="dark" content="清除过滤和排序" placement="top-end" v-if="bbarClear">
          <el-button icon="el-icon-refresh-left" size="mini" circle @click="onClearFilterSort"></el-button>
        </el-tooltip>
      </div>
    </div>
  </div>
</template>
<script>
import { getAppHeight, getStringLength } from '@/utils'
import { export2Excel } from '@/vendor'
export default {
  name: 'Grid',
  props: {
    loading: {
      type: Boolean,
      default: false
    },
    data: Array,
    offSetHeight: {
      type: Number,
      default: 15 //框架中.view-wrap padding-top
    },
    height: {
      type: Number,
      default: 0
    },
    highlightCurrentRow: {
      type: Boolean,
      default: false
    },
    border: {
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
    spanMethod: Function,

    bbarColumn: {
      type: Boolean,
      default: true
    },
    bbarExport: {
      type: Boolean,
      default: true
    },
    bbarExportAll: {
      type: Boolean,
      default: true
    },
    bbarClear: {
      type: Boolean,
      default: true
    }
  },
  computed: {
    tableHeight() {
      //height优先级高于offSetHeight, 如果没有传入height, 就取当前页面高度减去偏移高度
      let height = this.height == 0 ? getAppHeight() - this.offSetHeight : this.height
      if (this.pagination) {
        height = height - 42 //42是分页组件的高度
      }
      if (this.filterPosition !== 'none' || this.$slots.tbar !== undefined) {
        height = height - 40 //tbar高度, 如果tbar配置的不是标准的工具条, 可能高度会不正常
      }
      return height
    },
    colsFilter() {
      return this.columns.filter(c => c.filterBar)
    }
  },
  data() {
    return {
      highlight: '', //是否高亮显示内容
      selectSlotWidth: '84', //默认两个字的宽度

      columns: [], //列头数组{ label: llabel, value: prop, show: true }
      filterColumn: '',
      filterValue: '',
      slotsArray: {}, //默认插槽内的column对象,prop:slot

      currentParams: { pageNum: 1, filter: '', sort: '' }, //记录当前查询参数
      currentPage: 1,
      currentPageSize: undefined,
      currentRow: undefined,
      multipleSelection: undefined,

      $instance: undefined, //当前的实例
      sort: undefined, //排序参数
      filters: {}, //表头上的过滤参数

      bodyHeightStyle: '', //table-body高度,操作列显示的时候会用到
      hideCols: 0, //已隐藏的列的个数

      $table: undefined //table组件ref
    }
  },
  mounted() {
    this.$table = this.$refs.grid
    this.extractColumnProp()
    this.bodyHeightStyle = this.$refs.grid.$el.querySelector('.el-table__body-wrapper').style //'height: 632px;'
  },
  methods: {
    extractColumnProp() {
      let $slots = this.$slots.default
      for (let i = 0; i < $slots.length; i++) {
        const col = $slots[i]
        const { type, prop, label, filterBar } = col.componentInstance
        if (type !== 'selection') {
          this.columns.push({ label, value: prop, filterBar, show: true })
          this.slotsArray[prop] = col
          //一个字符6个宽度,中文字符表示两个字符, 两边留60的宽度
          if (this.selectSlotWidth < getStringLength(label) * 6 + 60) {
            this.selectSlotWidth = getStringLength(label) * 6 + 60
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
    onClearFilterSort() {
      this.$refs.grid.clearFilter()
      this.$refs.grid.clearSort()
      this.sort = undefined
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
    onShowColumn(val, prop) {
      if (!val) {
        this.hideCols++
      } else {
        this.hideCols--
      }
      this.slotsArray[prop].componentInstance.show(val)
      const $el = this.$refs.grid.$el
      const heightStyle = this.bodyHeightStyle
      setTimeout(function() {
        $el.querySelector('.el-table__body-wrapper').style = heightStyle
      }, 100)
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
        filter,
        sort:
          this.sort === undefined || this.sort === null
            ? ''
            : `${this.sort.prop} ${this.sort.order.replace(/ending/, '')}`
      }
      if (obj) {
        Object.assign(params, obj)
      }
      this.currentParams = params
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
    },
    updateRow(index, data) {
      this.$set(this.data, index, data)
    },
    getRows(key) {
      let indexs = []
      const rows = this.$refs.grid.selection
      if (rows.length === 0) {
        // 没有
        return { indexs: [], rows: [] }
      } else if (rows.length === this.data.length) {
        // 全部
        for (let i = 0; i < this.rows.length; i++) {
          indexs.push(i)
        }
        return { indexs, rows }
      } else {
        rows.forEach(r => {
          this.data.forEach((d, index) => {
            if (r[key] === d[key]) {
              indexs.push(index)
              return
            }
          })
        })
        return { indexs, rows }
      }
    },
    getRow(key, value) {
      let row = {}
      this.data.forEach((d, index) => {
        if (value === d[key]) {
          row.index = index
          row.row = d
          return
        }
      })
      return row
    },
    onExport() {
      let cols = []
      let data = []
      this.columns.forEach(col => {
        if (col.show) {
          //显示在页面上的就可以导出
          cols.push(col)
        }
      })
      this.data.forEach(d => {
        let newData = {}
        for (let i = 0; i < cols.length; i++) {
          newData[cols[i].value] = d[cols[i].value]
        }
        data.push(newData)
      })
      export2Excel(cols, data, '导出数据')
    },
    onExportFromServer() {
      // TODO 从服务端下载
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
.column-checked {
  display: block;
  margin: 5px 0;
}
.column-btn {
  margin-right: 10px;
  &.hide-cols {
    color: #409eff;
  }
}
</style>
