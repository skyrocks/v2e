export default {
  props: {
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
    }
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
