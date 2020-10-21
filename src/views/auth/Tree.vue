<!--
 * @Author: shilei
 * @Date: 2020-10-20 19:47:15
 * @LastEditors: shilei
 * @LastEditTime: 2020-10-21 17:50:31
 * @Description: 这是一个什么文件...
 * @FilePath: /aolong-parrot/src/views/auth/Tree.vue
-->
<template>
  <div>
    <div v-for="(node, index) in treeData" :key="index" class="node-item">
      <div class="node-wrap">
        <div class="arrow" @click="toggleExpand(node.id)">
          <i
            v-if="node.children && node.children.length > 0"
            :class="`el-icon-caret-bottom ${closeNode.indexOf(node.id) === -1 ? 'expend' : 'close'}`"
          ></i>
        </div>
        <el-checkbox
          v-model="node.checked"
          :indeterminate="node.indeterminate"
          class="checkbox"
          @change="onChangeNode($event, node)"
        ></el-checkbox>
        {{ node.label }}
        <span v-if="!node.children || node.children.length === 0">
          <el-button type="text" class="only-menu" @click="onCheckOnlyNode(node)">仅授权菜单</el-button>
        </span>
        <div class="func-wrap">
          <el-button
            v-for="(f, i) in node.funcKeys"
            :key="i"
            :type="`${f.checked ? 'primary' : ''}`"
            size="mini"
            :plain="!f.checked"
            @click="onClickFunc(f, node)"
          >
            {{ f.label }}
          </el-button>
        </div>
      </div>
      <div v-if="node.children && node.children.length > 0">
        <el-collapse-transition>
          <AuthMenuTree
            v-show="closeNode.indexOf(node.id) === -1"
            :tree-data="node.children"
            :parent-node="node"
            class="children"
            @trace="onTraceParent"
          ></AuthMenuTree>
        </el-collapse-transition>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'AuthMenuTree',
  props: {
    roleId: String,
    treeData: Array,
    parentNode: Object //这两个属性是给递归组件使用的
  },
  data() {
    return {
      closeNode: [], //展开的node
      parentNodes: {} //记录每个节点的父节点 id:parent
    }
  },
  methods: {
    isClose(id) {
      return this.closeNode.indexOf(id)
    },
    toggleExpand(id) {
      const index = this.closeNode.indexOf(id)
      if (index === -1) {
        this.closeNode.push(id)
      } else {
        this.closeNode.splice(index, 1)
      }
    },
    onClickFunc(func, node) {
      func.checked = !func.checked

      //点击func和点击仅授权菜单, 处理逻辑是一样的
      this.onCheckOnlyNode(node)
    },
    onCheckOnlyNode(node, endToSave = true) {
      //点击仅授权菜单, 不向下及联功能按钮
      //获得当前节点的funcKeys兄弟trueCount, falseCount
      let { trueCount, falseCount, totalCount } = this.getSiblingTrueFalse(node.funcKeys)
      //处理当前node的
      this.setIndeterminate(node, { trueCount, falseCount, totalCount })

      if (trueCount === 0 && totalCount > 0) {
        //在处理末级菜单时, 下级func都是未checked, 此时经过上面this.setIndeterminate处理indeterminate一定是false
        //但是在此需要强制实现indeterminate=true效果
        node.indeterminate = true
        trueCount++
        falseCount--
      }
      //只要是勾末级菜单的,就一定赋值true
      node.checked = true

      if (node.parentId !== '') {
        //再获得当前node兄弟的trueCount, falseCount, 累加
        //this.treeData在当前的子组件中已经是兄弟list了, 不是最原始的treeData
        const nodeCount = this.getSiblingTrueFalse(this.treeData)
        nodeCount.totalCount = nodeCount.totalCount + totalCount
        nodeCount.falseCount = nodeCount.falseCount + falseCount
        nodeCount.trueCount = nodeCount.trueCount + trueCount
        //向上及联
        this.$emit('trace', { traceNode: node, parent: this.parentNode, ...nodeCount })
      } else {
        if (endToSave) {
          //已经到顶级, 开始保存node, 只从初始点击的节点向下递归遍历即可
          this.saveCheckedItem(node)
        }
      }
    },
    onChangeNode(value, node) {
      // 向下及联
      this.checkChildren(node, value)
      // 向上及联
      this.checkParent(node)
    },
    checkChildren(node, value) {
      node.indeterminate = false
      //子节点递归处理
      if (node.children) {
        for (let i = 0; i < node.children.length; i++) {
          const child = node.children[i]
          child.checked = value
          this.checkChildren(child, value)
        }
      }
      //funcKeys功能按钮同样当作节点处理
      if (node.funcKeys) {
        for (let i = 0; i < node.funcKeys.length; i++) {
          const func = node.funcKeys[i]
          func.checked = value
        }
      }
    },
    checkParent(node) {
      //初始点击的节点, 从这里开始向上追溯
      if (node.parentId !== '') {
        //获得当前节点的兄弟trueCount, falseCount,
        //this.treeData在当前的子组件中已经是兄弟list了, 不是最原始的treeData
        const nodeCount = this.getSiblingTrueFalse(this.treeData)
        //向上追溯到最顶级
        this.$emit('trace', { traceNode: node, parent: this.parentNode, ...nodeCount })
      } else {
        //已经到顶级, 开始保存node, 只从初始点击的节点向下递归遍历即可
        this.saveCheckedItem(node)
      }
    },
    onTraceParent(child) {
      //先处理当前节点自己的状态, child.parent
      const node = child.parent

      //child中包括下级节点通过trace传上来的...nodeCount
      this.setIndeterminate(node, child)

      if (node.parentId !== '') {
        //获得当前节点的兄弟trueCount, falseCount
        //this.treeData在当前的子组件中已经是兄弟list了, 不是最原始的treeData
        const { trueCount, falseCount, totalCount } = this.getSiblingTrueFalse(this.treeData)

        //累加
        child.totalCount = child.totalCount + totalCount
        child.trueCount = child.trueCount + trueCount
        child.falseCount = child.falseCount + falseCount

        //父节点已经改变
        child.parent = this.parentNode

        //向上追溯到最顶级
        this.$emit('trace', child)
      } else {
        //已经到顶级, 开始保存node, 只从初始点击的节点向下递归遍历即可
        this.saveCheckedItem(child.traceNode)
      }
    },
    getSiblingTrueFalse(array) {
      //统计兄弟节点的TreeFalse
      if (array && array.length > 0) {
        let trueCount = 0
        let falseCount = 0
        for (let i = 0; i < array.length; i++) {
          const sibling = array[i]
          if (sibling.checked) {
            trueCount++
          } else {
            falseCount++
          }
        }
        return { trueCount, falseCount, totalCount: array.length }
      } else {
        return { trueCount: 0, falseCount: 0, totalCount: 0 }
      }
    },
    setIndeterminate(node, count) {
      //处理node不确定状态
      if (count.totalCount === count.trueCount) {
        // falseCount == 0
        node.checked = true
        node.indeterminate = false
      } else if (count.totalCount === count.falseCount) {
        //trueCount === 0
        node.checked = false
        node.indeterminate = false
      } else {
        // trueCount > 0 && falseCount > 0
        node.checked = false
        node.indeterminate = true
      }
    },
    saveCheckedItem(node) {
      //向下递归获取所有checked的末级node和func
      const array = this.getChildren(node)

      this.$emit('auth', array)
    },
    getChildren(child, trueNodeIds = [], trueFuncKeys = [], falseNodeIds = [], falseFuncKeys = []) {
      if (child.children && child.children.length > 0) {
        for (let i = 0; i < child.children.length; i++) {
          const node = child.children[i]
          this.getChildren(node, trueNodeIds, trueFuncKeys, falseNodeIds, falseFuncKeys)
        }
      } else {
        if (child.checked) {
          trueNodeIds.push(child.id)
        } else {
          falseNodeIds.push(child.id)
        }
      }
      //当前节点的funcKeys
      if (child.funcKeys) {
        for (let i = 0; i < child.funcKeys.length; i++) {
          const func = child.funcKeys[i]
          if (func.checked) {
            trueFuncKeys.push(func.id)
          } else {
            falseFuncKeys.push(func.id)
          }
        }
      }
      return { trueNodeIds, trueFuncKeys, falseNodeIds, falseFuncKeys }
    },
    updateStatus(nodeList, ids, funcKeys) {
      //先更新末级checked
      const updatedNodes = this.updateChecked(nodeList, null, ids, funcKeys)
      //updatedNodes全部都是末级节点
      for (let i = updatedNodes.length - 1; i >= 0; i--) {
        const node = updatedNodes[i]
        //只有末级菜单node才会走这个处理
        let { trueCount, falseCount, totalCount } = this.getSiblingTrueFalse(node.funcKeys)
        this.setIndeterminate(node, { trueCount, falseCount, totalCount })
        if (trueCount === 0 && totalCount > 0) {
          //在处理末级菜单时, 下级func都是未checked, 此时经过上面this.setIndeterminate处理indeterminate一定是false
          //但是在此需要强制实现indeterminate=true效果
          node.indeterminate = true
        }
        //经过setIndeterminate处理,可能把checked设置成了false, 但是进来的updatedNodes全都是末级且checked=true的,所以强制true一下
        node.checked = true

        //在向上递归处理父级
        let parent = this.parentNodes[node.id]
        while (parent !== null) {
          let count = this.getSiblingTrueFalse(parent.children)
          totalCount = totalCount + count.totalCount
          trueCount = trueCount + count.trueCount
          falseCount = falseCount + count.falseCount
          this.setIndeterminate(parent, { trueCount, falseCount, totalCount })
          parent = this.parentNodes[parent.id]
        }
      }
    },
    updateChecked(nodeList, parent, ids, funcKeys, updatedNodes = []) {
      //递归将菜单及权限的checked更新
      for (let i = 0; i < nodeList.length; i++) {
        let nodePushed = false
        let node = nodeList[i]
        this.parentNodes[node.id] = parent
        if (ids.indexOf(node.id) >= 0) {
          node.checked = true
          updatedNodes.push(node)
          nodePushed = true
        }
        if (node.funcKeys && funcKeys.length > 0) {
          for (let f = 0; f < node.funcKeys.length; f++) {
            let func = node.funcKeys[f]
            if (funcKeys.indexOf(func.id) >= 0) {
              func.checked = true
              if (!nodePushed) {
                updatedNodes.push(node)
                nodePushed = true
              }
            }
          }
        }
        if (node.children) {
          this.updateChecked(node.children, node, ids, funcKeys, updatedNodes)
        }
      }
      //返回所有更新过的节点的父节点集合
      return updatedNodes
    }

    // findParent(func, path = []) {
    //   for (const node of this.treeData) {
    //     path.push(node)
    //     if (func(node)) return path
    //     if (node.children) {
    //       const findChildren = this.findParent(node.children, func, path)
    //       if (findChildren.length) return findChildren
    //     }
    //     path.pop()
    //   }
    //   return []
    // }
  }
}
</script>

<style lang="scss" scoped>
.node-wrap {
  padding: 5px 0;
  &:hover {
    background-color: #f5f7fa;
    cursor: pointer;
  }
}
.children {
  padding-left: 18px;
}
.arrow {
  display: inline-block;
  width: 20px;
  color: #c0c4cc;
}
.checkbox {
  padding-right: 3px;
}
.only-menu {
  display: none;
  padding: 0px 20px;
}
.node-wrap:hover .only-menu {
  display: inline-block;
}
.func-wrap {
  padding: 5px 0 5px 40px;
  button {
    padding: 5px 15px;
    margin-top: 8px;
  }
  .el-button + .el-button {
    margin-left: 0px;
  }
  .el-button {
    margin-right: 10px;
  }
}

i.close {
  transform: rotate(-90deg);
  transition: transform 0.2s linear;
}
i.expend {
  transform: rotate(0deg);
  transition: transform 0.2s linear;
}
</style>
