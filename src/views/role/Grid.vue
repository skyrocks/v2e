<template>
  <div>
    <grid
      ref="grid"
      :data="roleData"
      :height="height"
      :total="total"
      filter-position="left"
      :bbar-column="false"
      :bbar-export="false"
      :bbar-export-all="false"
      @reload="loadRole"
      @selection-change="onSelectionChange"
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
    <div style="margin: 15px 0;">
      <el-button @click="onClose">取 消</el-button>
      <el-button type="primary" @click="onSelect">
        {{ selection.length > 0 ? `选 择 (${selection.length})` : '选 择' }}
      </el-button>
    </div>
  </div>
</template>

<script>
import { Grid, Column } from '@/components/Grid'
import { findAll } from '@/api/role'
export default {
  name: 'RoleGrid',
  components: { Grid, Column },
  props: {
    height: {
      type: Number,
      require: true
    }
  },
  data() {
    return {
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
    doLayout() {
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
        // const rows = JSON.parse(JSON.stringify(this.selection))
        // this.$refs.grid.$table.clearSelection()
        this.$emit('selected', this.selection)
      } else {
        this.$message.warning('请勾选角色记录')
      }
    }
  }
}
</script>
