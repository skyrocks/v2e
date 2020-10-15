<!--
 * @Author: shilei
 * @Date: 2020-09-22 10:33:29
 * @LastEditors: shilei
 * @LastEditTime: 2020-10-15 15:04:53
 * @Description: 这是一个什么文件...
 * @FilePath: /aolong-parrot/src/views/role/index.vue
-->
<template>
  <div class="view-wrap">
    <grid :data="roleData" :height="height" :total="total" @reload="loadRole">
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
  </div>
</template>

<script>
import { Grid, Column } from '@/components/Grid'
import { getAppHeight } from '@/utils'
import { findAll } from '@/api/role'

export default {
  name: 'Role',
  components: { Grid, Column },
  data() {
    return {
      search: '',
      roleData: [],
      total: 0
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
    }
  }
}
</script>
