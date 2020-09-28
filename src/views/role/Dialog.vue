<template>
  <el-dialog
    title="选择角色"
    top="5vh"
    :visible.sync="visibleDialog"
    width="70%"
    :close-on-click-modal="false"
    @close="onClose"
    @opened="onOpen"
  >
    <grid
      ref="grid"
      :data="roleData"
      :height="590"
      :total="total"
      @reload="loadRole"
      filterPosition="left"
      @selection-change="onSelectionChange"
      :bbar-column="false"
      :bbar-export="false"
      :bbar-export-all="false"
    >
      <column type="selection"></column>
      <column prop="roleCode" label="角色编号"></column>
      <column prop="roleName" label="角色名称"></column>
      <column
        prop="roleStatus"
        label="状态"
        :formatter="formatter"
        column-key="roleStatus"
        filter-multiple
        :filters="[
          { text: '正常', value: 1 },
          { text: '禁用', value: 0 }
        ]"
      ></column>
      <column
        prop="roleType"
        label="类型"
        :formatter="formatter"
        column-key="roleType"
        filter-multiple
        :filters="[
          { text: '用户角色', value: 1 },
          { text: '系统角色', value: 0 }
        ]"
      ></column>
    </grid>
    <div slot="footer">
      <el-button @click="onClose">关 闭</el-button>
      <el-button type="primary" @click="onSelect">
        {{ selection.length > 0 ? `选 择 (${selection.length})` : '选 择' }}
      </el-button>
    </div>
  </el-dialog>
</template>

<script>
import { Grid, Column } from '@/components/Grid'
import { findAll } from '@/api/role'

export default {
  name: 'RoleDialog',
  components: { Grid, Column },
  props: {
    visible: {
      type: Boolean,
      default: () => false
    }
  },
  watch: {
    visible(val) {
      this.visibleDialog = val
    }
  },
  data() {
    return {
      visibleDialog: false,

      roleData: [],
      total: 0,

      selection: []
    }
  },
  mounted() {
    this.loadRole({ pageNum: 1, filter: '', sort: '' })
  },
  methods: {
    loadRole(gridParam) {
      findAll({}, gridParam.filter, gridParam.sort, gridParam.pageNum, gridParam.pageSize).then(res => {
        if (res.success) {
          this.roleData = res.data.list
          this.total = res.data.total
        }
      })
    },
    formatter(row, column) {
      if (column.property === 'roleType') {
        if (row.roleType === 0) {
          return '系统角色'
        } else if (row.userStatus === 1) {
          return '用户角色'
        }
      } else if (column.property === 'roleStatus') {
        if (row.roleStatus === 1) {
          return '正常'
        } else {
          return '禁用'
        }
      } else {
        return row[column.property]
      }
    },
    onOpen() {
      this.$refs.grid.$table.doLayout()
    },
    onSelectionChange(rows) {
      this.selection = rows
    },
    onClose() {
      this.$emit('close')
    },
    onSelect() {
      if (this.selection.length > 0) {
        this.$emit('selected', this.selection)
      } else {
        this.$message.warning('请勾选角色记录')
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.dialog-title {
  line-height: 24px;
  font-size: $size-font-larger;
  color: $color-font-black;
  .count {
    margin-left: 15px;
    color: $color-font-blue;
    font-size: $size-font-normal;
    font-weight: bold;
  }
}
</style>
