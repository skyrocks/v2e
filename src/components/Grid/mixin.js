/*
 * @Author: shilei
 * @Date: 2020-09-22 16:02:19
 * @LastEditors: shilei
 * @LastEditTime: 2020-10-27 16:17:27
 * @Description: 这是一个什么文件...
 * @FilePath: /aolong-parrot/src/components/Grid/mixin.js
 */
export default {
  props: {
    has: String,
    type: String,
    prop: String,
    label: String,
    sortable: {
      default: () => 'custom' // 默认远程排序
    },
    formatter: Function,
    columnKey: String,
    filterMultiple: Boolean,
    filters: Array,
    filterBar: {
      type: Boolean,
      default: () => true // 是否加载到头部的下来过滤组件内
    },
    className: String
  },
  data() {
    return {
      showColumn: true,
      isHas: this.$has(this.has)
    }
  },
  methods: {
    show(val) {
      this.showColumn = val
    }
  }
}
