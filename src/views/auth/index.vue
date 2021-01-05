<!--
 * @Author: shilei
 * @Date: 2020-10-20 15:27:14
 * @LastEditors: shilei
 * @LastEditTime: 2020-10-26 16:47:26
 * @Description: 角色授权
 * @FilePath: /aolong-parrot/src/views/auth/index.vue
-->
<template>
  <div class="wrap" :style="`height: ${height}px;`">
    <split-pane split="vertical">
      <template slot="paneL">
        <div class="border-r">
          <grid
            ref="grid"
            class="role-grid"
            :data="roleData"
            :total="total"
            :highlight-current-row="true"
            filter-position="left"
            :loading="loading"
            @current-row-change="onSelectRow"
            @reload="loadRole"
          >
            <column prop="roleName" label="角色名称" :formatter="formatter"></column>
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
        </div>
      </template>
      <template slot="paneR">
        <div class="border-l">
          <div class="role-title">
            <i class="el-icon-user-solid"></i>
            <span v-if="selectedRole.roleName !== undefined">{{ selectedRole.roleName }}</span>
            <span v-if="selectedRole.roleName === undefined">请选择授权的角色</span>
          </div>
          <div :style="`height: ${height - 120}px; overflow-y: auto;`">
            <!-- <el-tree
              ref="tree"
              :data="treeData"
              show-checkbox
              default-expand-all
              node-key="id"
              highlight-current
            ></el-tree> -->
            <Tree
              ref="tree"
              class="menu-tree"
              :tree-data="treeData"
              :role-id="selectedRole.roleId"
              style="margin-left: 5px;"
              @auth="authMenu"
            ></Tree>
          </div>
        </div>
      </template>
    </split-pane>
  </div>
</template>

<script>
import { mixin } from '@/mixin'
import { guide } from './guide'
import splitPane from 'vue-splitpane'
import { getAppHeight } from '@/utils'
import { Grid, Column } from '@/components/Grid'
import { findAll } from '@/api/role'
import { findMenus, authMenus, findRoleAuthMenu } from '@/api/menu'
import Tree from './Tree'
export default {
  name: 'Auth',
  components: { splitPane, Grid, Column, Tree },
  mixins: [guide, mixin],
  data() {
    return {
      loading: true,

      roleData: [],
      total: 0,

      selectedRole: {},

      authTreeData: {},
      treeDataClone: [],
      treeData: []
    }
  },
  computed: {
    height() {
      return getAppHeight()
    }
  },
  mounted() {
    this.loadRole({ pageNum: 1, filter: '', sort: '' })
    this.loadAllMenu()
  },
  methods: {
    loadRole(gridParam) {
      this.selectedRole = {} //清除选中的
      findAll({}, gridParam.filter, gridParam.sort, gridParam.pageNum, gridParam.pageSize).then(res => {
        if (res.success) {
          this.roleData = res.data.list
          this.total = res.data.total
        }
        this.loading = false
      })
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
          return (
            <el-tag size="mini" type="info" effect="dark">
              禁用
            </el-tag>
          )
        }
      } else if (column.property === 'roleName') {
        return <span style="padding-left: 5px;">{row.roleName}</span>
      } else {
        return row[column.property]
      }
    },
    onSelectRow(row) {
      if (row == null) return
      this.selectedRole = row
      findRoleAuthMenu(row.roleId).then(res => {
        if (res.success) {
          //都是末级菜单和权限
          this.authTreeData = res.data
          //更新treeData状态, 先全部恢复
          this.treeData = JSON.parse(JSON.stringify(this.treeDataClone))

          if (this.authTreeData.menuIds.length === 0) {
            //如果当前角色没有任何授权数据,直接退出
            return
          }

          //递归将菜单及权限的checked更新, indeterminate
          this.$refs.tree.updateStatus(this.treeData, this.authTreeData.menuIds, this.authTreeData.funcKeys)
        }
      })
    },

    loadAllMenu() {
      findMenus().then(res => {
        if (res.success) {
          this.treeData = res.data
          this.treeDataClone = JSON.parse(JSON.stringify(res.data))
        }
      })
    },
    authMenu(menus) {
      if (this.selectedRole.roleId) {
        authMenus(
          this.selectedRole.roleId,
          menus.trueNodeIds,
          menus.trueFuncKeys,
          menus.falseNodeIds,
          menus.falseFuncKeys
        ).then(res => {
          if (res.success) {
            this.$message.success('菜单功能已经授权成功')
          } else {
            this.$message.error(res.message)
          }
        })
      } else {
        this.$message.warning('请先选择角色之后在进行授权操作')
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.wrap {
  position: relative;
  .border-l {
    border-left: 1px solid $color-border-grey;
    height: 100vh;
    padding: 0 15px;
  }
  .border-r {
    border-right: 1px solid $color-border-grey;
    height: 100vh;
  }
  .role-title {
    margin-bottom: 15px;
    border-radius: 4px;
    padding: 8px 16px;
    background-color: $color-border-blue;
    color: $color-font-blue;
    line-height: 50px;
    font-size: 18px;
    i {
      margin-right: 5px;
    }
  }
  .tree-opera {
    padding-left: 10px;
    display: none;
  }
  .el-tree-node__content:hover .tree-opera {
    display: inline-block;
  }
}
</style>
