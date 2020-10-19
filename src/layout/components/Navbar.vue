<template>
  <div class="navbar">
    <hamburger :is-active="sidebar.opened" class="hamburger-container" @toggleClick="toggleSideBar" />

    <breadcrumb class="breadcrumb-container" />

    <div class="right-menu">
      <el-dropdown class="avatar-container" trigger="click">
        <div class="avatar-wrapper">
          <!-- <img :src="avatar + '?imageView2/1/w/80/h/80'" class="user-avatar" /> -->
          <!-- <img src="@/assets/avatar_images/default.png" class="user-avatar" /> -->
          <!-- <el-avatar shape="square" size="medium" fit="cover" :src="avatar">
            {{ name }}
          </el-avatar> -->
          <el-image class="avatar" :src="avatar" fit="cover">
            <div slot="error">
              <el-avatar shape="square" size="medium" fit="cover">
                {{ name }}
              </el-avatar>
            </div>
          </el-image>
          <i class="el-icon-caret-bottom" />
        </div>
        <el-dropdown-menu slot="dropdown" class="user-dropdown">
          <router-link to="/">
            <el-dropdown-item>
              首页
            </el-dropdown-item>
          </router-link>
          <router-link to="/pwd">
            <el-dropdown-item>
              修改密码
            </el-dropdown-item>
          </router-link>
          <!-- <a target="_blank" href="https://github.com/PanJiaChen/vue-admin-template/">
            <el-dropdown-item>Github</el-dropdown-item>
          </a>
          <a target="_blank" href="https://panjiachen.github.io/vue-element-admin-site/#/">
            <el-dropdown-item>Docs</el-dropdown-item>
          </a> -->
          <el-dropdown-item divided @click.native="logout">
            <span style="display:block;">注销</span>
          </el-dropdown-item>
        </el-dropdown-menu>
      </el-dropdown>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import Breadcrumb from '@/components/Breadcrumb'
import Hamburger from '@/components/Hamburger'
import request from '@/plugins/request'
import { logout } from '@/api/auth'

export default {
  components: {
    Breadcrumb,
    Hamburger
  },
  data() {
    return {
      avatar: ''
    }
  },
  computed: {
    ...mapGetters(['sidebar']),
    name() {
      const name = this.$store.getters.name
      if (name && name.length > 2) {
        return name.substring(name.length - 2, name.length)
      } else {
        return name
      }
    }
  },
  mounted() {
    this.getAvatar()
  },
  methods: {
    getAvatar() {
      request({
        url: `/api/users/photo/${this.$store.getters.userId}`,
        responseType: 'blob',
        method: 'get'
      }).then(res => {
        this.avatar = URL.createObjectURL(new Blob([res]))
      })
    },
    toggleSideBar() {
      this.$store.dispatch('app/toggleSideBar')
    },
    async logout() {
      const loginName = this.$store.getters.loginName
      await this.$store.dispatch('auth/logout')
      if (process.env.VUE_APP_SSO_MODE === 'cas') {
        // CAS模式, 跳转到CAS后端再重定向
        window.location.href = `${process.env.VUE_APP_BASE_API}/cas/logout/${loginName}`
      } else {
        logout(loginName)
        this.$router.push(`/login?redirect=${this.$route.fullPath}`)
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.navbar {
  height: 50px;
  overflow: hidden;
  position: relative;
  background: #fff;
  box-shadow: 0 1px 4px rgba(0, 21, 41, 0.08);

  .avatar {
    width: 36px;
    height: 36px;
    border-radius: 4px;
    cursor: pointer;
  }
  .hamburger-container {
    line-height: 46px;
    height: 100%;
    float: left;
    cursor: pointer;
    transition: background 0.3s;
    -webkit-tap-highlight-color: transparent;

    &:hover {
      background: rgba(0, 0, 0, 0.025);
    }
  }

  .breadcrumb-container {
    float: left;
  }

  .right-menu {
    float: right;
    height: 100%;
    line-height: 50px;

    &:focus {
      outline: none;
    }

    .right-menu-item {
      display: inline-block;
      padding: 0 8px;
      height: 100%;
      font-size: 18px;
      color: #5a5e66;
      vertical-align: text-bottom;

      &.hover-effect {
        cursor: pointer;
        transition: background 0.3s;

        &:hover {
          background: rgba(0, 0, 0, 0.025);
        }
      }
    }

    .avatar-container {
      margin-right: 30px;

      .avatar-wrapper {
        margin-top: 5px;
        position: relative;

        .user-avatar {
          cursor: pointer;
          width: 40px;
          height: 40px;
          border-radius: 10px;
        }

        .el-icon-caret-bottom {
          cursor: pointer;
          position: absolute;
          right: -20px;
          top: 25px;
          font-size: 12px;
        }
      }
    }
  }
}
</style>
