<!--
 * @Author: shilei
 * @Date: 2020-09-22 10:33:29
 * @LastEditors: shilei
 * @LastEditTime: 2020-10-19 21:42:20
 * @Description: 角色管理
 * @FilePath: /aolong-parrot/src/views/role/index.vue
-->
<template>
  <div>
    <grid ref="grid" :data="roleData" :height="height" :total="total" @reload="loadRole">
      <template slot="tbar">
        <el-button-group>
          <default-button
            class="add"
            has="Add"
            el-icon="circle-plus-outline"
            @click="
              () => {
                currentRole = { roleId: '', roleName: '', roleStatus: 1 }
                roleFormTitle = '添加角色'
                dialogRoleForm = true
              }
            "
          >
            添加自定义角色
          </default-button>
          <default-button class="delete" has="Remove" el-icon="delete" @click="onDeleteRoles">
            删除自定义角色
          </default-button>
        </el-button-group>
      </template>
      <column type="selection"></column>
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
      <column prop="userCount" label="用户数量"></column>
      <ColumnTemplate label="修改">
        <template slot-scope="scope">
          <el-button
            size="mini"
            icon="el-icon-edit"
            @click="
              () => {
                currentRole = scope.row
                roleFormTitle = '修改角色'
                dialogRoleForm = true
              }
            "
          >
            修改
          </el-button>
        </template>
      </ColumnTemplate>
    </grid>

    <el-dialog :visible.sync="dialogRoleForm" :title="roleFormTitle" width="30%" :close-on-click-modal="false">
      <RoleForm :data="currentRole" @close="dialogRoleForm = false" @success="onSaveSuccess"></RoleForm>
    </el-dialog>
  </div>
</template>

<script>
import { mixin } from '@/mixin'
import { guide } from './guide'
import { Grid, Column, ColumnTemplate } from '@/components/Grid'
import { MessageBox } from 'element-ui'
import { getAppHeight } from '@/utils'
import { findAll } from '@/api/role'
import RoleForm from './RoleForm'
import { remove } from '@/api/role'

export default {
  name: 'Role',
  components: { Grid, Column, ColumnTemplate, RoleForm },
  mixins: [guide, mixin],
  data() {
    return {
      search: '',
      roleData: [],
      total: 0,

      currentRole: {}, //当前角色
      dialogRoleForm: false, //显示角色编辑窗口
      roleFormTitle: ''
    }
  },
  computed: {
    height() {
      return getAppHeight() - 15 // 减去.view-wrap
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
    onSaveSuccess(formData) {
      this.dialogRoleForm = false
      if (formData.roleId === '') {
        //新增
        this.loadRole(this.$refs.grid.currentParams)
      } else {
        const { index } = this.$refs.grid.getRow('roleId', this.currentRole.roleId)
        Object.assign(this.currentRole, formData)
        this.$refs.grid.updateRow(index, this.currentRole)
      }
    },
    onDeleteRoles() {
      const ids = this.getIds()
      if (ids.length === 0) {
        return
      }
      MessageBox.confirm('确定要删除吗?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          remove(ids).then(res => {
            if (res.success) {
              this.loadRole(this.$refs.grid.currentParams)
            }
          })
        })
        .catch(() => {})
    },
    formatter(row, column) {
      if (column.property === 'roleType') {
        if (row.roleType === 0) {
          return '系统角色'
        } else if (row.roleType === 1) {
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
    getIds() {
      const rows = this.$refs.grid.$table.selection
      let checkIds = []
      for (let i = 0; i < rows.length; i++) {
        checkIds.push(rows[i].roleId)
      }
      return checkIds
    }
  }
}
</script>
