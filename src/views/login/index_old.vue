<template>
  <div class="login-container">
    <el-form
      ref="loginForm"
      :model="loginForm"
      :rules="loginRules"
      class="login-form"
      auto-complete="on"
      label-position="left"
    >
      <div class="title-container">
        <h3 class="title">Login Form</h3>
      </div>

      <el-form-item prop="loginName">
        <span class="svg-container">
          <svg-icon icon-class="user" />
        </span>
        <el-input
          ref="loginName"
          v-model="loginForm.loginName"
          placeholder="LoginName"
          name="loginName"
          type="text"
          tabindex="1"
          auto-complete="on"
        />
      </el-form-item>

      <el-form-item prop="password">
        <span class="svg-container">
          <svg-icon icon-class="password" />
        </span>
        <el-input
          :key="passwordType"
          ref="password"
          v-model="loginForm.password"
          :type="passwordType"
          placeholder="Password"
          name="password"
          tabindex="2"
          auto-complete="on"
          @keyup.enter.native="handleLogin"
        />
        <span class="show-pwd" @click="showPwd">
          <svg-icon :icon-class="passwordType === 'password' ? 'eye' : 'eye-open'" />
        </span>
      </el-form-item>

      <div class="verifyCode-wrap">
        <div>验证码:</div>
        <el-input v-model="inputVerifyCode" placeholder="请输入验证码"></el-input>
        <el-image
          style="width: 80px; height: 28px;"
          :src="verifyCodeUrl"
          :fit="fit"
          @click="refreshVerifyCode"
        ></el-image>
        <div @click="refreshVerifyCode">点击刷新</div>
      </div>

      <el-button
        :loading="loading"
        type="primary"
        style="width:100%;margin-bottom:30px;"
        @click.native.prevent="handleLogin"
      >
        Login
      </el-button>

      <div class="tips">
        <span style="margin-right:20px;">loginName: admin</span>
        <span>password: any</span>
      </div>
    </el-form>

    <el-input v-model="inputCellphone" placeholder="手机号"></el-input>
    <el-input v-model="inputSMSCode" placeholder="短信验证码"></el-input>
    <el-button :loading="loading" type="primary" style="margin-bottom:30px;" @click.native.prevent="sendCode">
      点击获取验证码
    </el-button>
    <el-button
      :loading="loading"
      type="primary"
      style="width:100%;margin-bottom:30px;"
      @click.native.prevent="handleLoginSMS"
    >
      短信登录
    </el-button>
  </div>
</template>

<script>
import uuidv1 from 'uuid/v1'
import { sendSmsCode } from '@/api/auth'

export default {
  name: 'Login',
  data() {
    const validateLoginName = (rule, value, callback) => {
      if (!this.validLoginName(value)) {
        callback(new Error('Please enter the correct user name'))
      } else {
        callback()
      }
    }
    const validatePassword = (rule, value, callback) => {
      if (value.length < 0) {
        callback(new Error('The password can not be less than 1 digits'))
      } else {
        callback()
      }
    }

    return {
      inputSMSId: '',
      inputCellphone: '',
      inputSMSCode: '',

      // 图片验证码的请求地址
      verifyCodeId: '',
      verifyCodeUrl: '',
      inputVerifyCode: '',

      loginForm: {
        loginName: 'devtest',
        password: '1'
      },
      loginRules: {
        loginName: [{ required: true, trigger: 'blur', validator: validateLoginName }],
        password: [{ required: true, trigger: 'blur', validator: validatePassword }]
      },
      loading: false,
      passwordType: 'password',
      redirect: undefined
    }
  },
  watch: {
    $route: {
      handler: function(route) {
        this.redirect = route.query && route.query.redirect
      },
      immediate: true
    }
  },
  mounted() {
    this.refreshVerifyCode()
  },
  methods: {
    showPwd() {
      if (this.passwordType === 'password') {
        this.passwordType = ''
      } else {
        this.passwordType = 'password'
      }
      this.$nextTick(() => {
        this.$refs.password.focus()
      })
    },
    handleLogin() {
      this.$refs.loginForm.validate(valid => {
        if (valid) {
          this.loading = true
          const data = Object.assign(this.loginForm, {
            captcha: this.inputVerifyCode,
            captchaId: this.verifyCodeId
          })
          this.$store
            .dispatch('auth/login', data)
            .then(() => {
              this.$router.push({ path: this.redirect || '/' })
              this.loading = false
            })
            .catch(() => {
              this.loading = false
            })
        } else {
          return false
        }
      })
    },
    validLoginName() {
      // const valid_map = ['devtest', 'admin', 'editor']
      // return valid_map.indexOf(str.trim()) >= 0
      return true
    },

    refreshVerifyCode() {
      this.verifyCodeId = uuidv1()
      this.verifyCodeUrl = `${process.env.VUE_APP_BASE_API}/api/auth/captcha/${this.verifyCodeId}`
    },

    sendCode() {
      this.inputSMSId = uuidv1()
      const data = { id: this.inputSMSId, cellphone: this.inputCellphone }
      sendSmsCode(data).then(response => {
        console.log(response.data)
      })
    },

    handleLoginSMS() {
      const data = { id: this.inputSMSId, cellphone: this.inputCellphone, code: this.inputSMSCode }
      this.$store
        .dispatch('auth/loginSMS', data)
        .then(() => {
          this.$router.push({ path: this.redirect || '/' })
          this.loading = false
        })
        .catch(() => {
          this.loading = false
        })
    }
  }
}
</script>

<style lang="scss">
/* 修复input 背景不协调 和光标变色 */
/* Detail see https://github.com/PanJiaChen/vue-element-admin/pull/927 */

$bg: #283443;
$light_gray: #fff;
$cursor: #fff;

@supports (-webkit-mask: none) and (not (cater-color: $cursor)) {
  .login-container .el-input input {
    color: $cursor;
  }
}

/* reset element-ui css */
.login-container {
  .el-input {
    display: inline-block;
    height: 47px;
    width: 85%;

    input {
      background: transparent;
      border: 0px;
      -webkit-appearance: none;
      border-radius: 0px;
      padding: 12px 5px 12px 15px;
      color: $light_gray;
      height: 47px;
      caret-color: $cursor;

      &:-webkit-autofill {
        box-shadow: 0 0 0px 1000px $bg inset !important;
        -webkit-text-fill-color: $cursor !important;
      }
    }
  }

  .el-form-item {
    border: 1px solid rgba(255, 255, 255, 0.1);
    background: rgba(0, 0, 0, 0.1);
    border-radius: 5px;
    color: #454545;
  }
}
</style>

<style lang="scss" scoped>
$bg: #2d3a4b;
$dark_gray: #889aa4;
$light_gray: #eee;

.login-container {
  min-height: 100%;
  width: 100%;
  background-color: $bg;
  overflow: hidden;

  .login-form {
    position: relative;
    width: 520px;
    max-width: 100%;
    padding: 160px 35px 0;
    margin: 0 auto;
    overflow: hidden;
  }

  .tips {
    font-size: 14px;
    color: #fff;
    margin-bottom: 10px;

    span {
      &:first-of-type {
        margin-right: 16px;
      }
    }
  }

  .svg-container {
    padding: 6px 5px 6px 15px;
    color: $dark_gray;
    vertical-align: middle;
    width: 30px;
    display: inline-block;
  }

  .title-container {
    position: relative;

    .title {
      font-size: 26px;
      color: $light_gray;
      margin: 0px auto 40px auto;
      text-align: center;
      font-weight: bold;
    }
  }

  .show-pwd {
    position: absolute;
    right: 10px;
    top: 7px;
    font-size: 16px;
    color: $dark_gray;
    cursor: pointer;
    user-select: none;
  }

  .verifyCode-wrap {
    cursor: pointer;
    div {
      display: inline-block;
      color: white;
    }
  }
}
</style>
