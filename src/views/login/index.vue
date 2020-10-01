<template>
  <div class="bg">
    <el-row>
      <el-col :span="6" :offset="14">
        <div class="login-container">
          <div class="login-type-container">
            <el-button type="text" @click.native.prevent="loginType = 0">
              <span :class="`login-type ${loginType === 0 ? 'active' : ''}`">密码登录</span>
            </el-button>
            <el-button type="text" @click.native.prevent="loginType = 1">
              <span :class="`login-type ${loginType === 1 ? 'active' : ''}`">短信登录</span>
            </el-button>
          </div>
          <div class="login-pwd-container" v-show="loginType === 0">
            <el-form>
              <el-form-item>
                <el-input placeholder="请输入账号" v-model="form.pwd.loginName">
                  <template slot="prepend"><i class="el-icon-user icon-style"></i></template>
                </el-input>
              </el-form-item>
              <el-form-item>
                <el-input
                  placeholder="请输入密码"
                  show-password
                  v-model="form.pwd.password"
                  @keyup.enter.native="onPwdLogin"
                >
                  <template slot="prepend"><i class="el-icon-lock icon-style"></i></template>
                </el-input>
              </el-form-item>
              <transition name="el-zoom-in-top">
                <el-form-item v-show="showCaptcha">
                  <el-input
                    placeholder="请输入图片验证码"
                    v-model="form.pwd.captcha"
                    style="width:65%;"
                    @keyup.enter.native="onPwdLogin"
                  >
                    <template slot="prepend">
                      <i class="el-icon-c-scale-to-original icon-style"></i>
                    </template>
                  </el-input>
                  <div style="width:35%; display:inline-block;">
                    <el-tooltip effect="dark" content="点击刷新" placement="right" :open-delay="500">
                      <el-image
                        class="captcha-img"
                        :src="captchaUrl"
                        @click.native.prevent="onRefreshCaptcha"
                      ></el-image>
                    </el-tooltip>
                  </div>
                </el-form-item>
              </transition>
              <el-form-item>
                <el-button type="success" :loading="loading" style="width: 100%" @click.native.prevent="onPwdLogin">
                  <span class="submit-text">登录</span>
                </el-button>
              </el-form-item>
            </el-form>
            <div class="tbar">
              <el-button type="text"><span class="forget-pwd">忘记密码</span></el-button>
            </div>
          </div>
          <div class="login-sms-container" v-show="loginType === 1">
            <el-form>
              <el-form-item>
                <el-input placeholder="请输入手机号码" v-model="form.sms.cellphone">
                  <template slot="prepend">
                    <i class="el-icon-mobile-phone icon-style"></i>
                  </template>
                </el-input>
              </el-form-item>
              <el-form-item>
                <el-input placeholder="请输入短信验证码" v-model="form.sms.smsCode" @keyup.enter.native="onSmsLogin">
                  <template slot="prepend">
                    <i class="el-icon-c-scale-to-original icon-style"></i>
                  </template>
                  <template slot="suffix">
                    <el-button type="text" @click.native.prevent="onSendSmsCode" :disabled="waiting">
                      <span :class="`get-smsCode ${waiting ? 'waiting' : ''}`">
                        {{ waiting ? waitText : '发送验证码' }}
                      </span>
                    </el-button>
                  </template>
                </el-input>
              </el-form-item>
              <el-form-item>
                <el-button type="success" :loading="loading" style="width: 100%" @click.native.prevent="onSmsLogin">
                  <span class="submit-text">登录</span>
                </el-button>
              </el-form-item>
            </el-form>
          </div>
        </div>
      </el-col>
    </el-row>
  </div>
</template>
<script>
import uuidv1 from 'uuid/v1'
import { mixin } from './mixin'
import { createDynamicRouter } from '@/router/menu'
import { sendSmsCode, loginError } from '@/api/auth'

export default {
  name: 'Login',
  mixins: [mixin],
  data() {
    return {
      loginType: 0, //0:pwd, 1:sms
      showCaptcha: false, //默认不显示图片验证码,登录错误的时候再显示
      captchaUrl: '', //验证码图片的地址
      form: {
        pwd: {
          loginName: '',
          password: '',
          captcha: '',
          captchaId: ''
        },
        sms: {
          cellphone: '',
          smsCode: '',
          smsCodeId: ''
        }
      },
      redirect: undefined,
      loading: false, //登录等待标志
      waiting: false, //发送验证码后的等待标志
      intervalId: null, //发送验证码后的计时器Id
      waitText: '',
      lastTime: 60
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
    this.loadLoginError()
    this.onRefreshCaptcha()
  },
  methods: {
    loadLoginError() {
      loginError().then(response => {
        this.showCaptcha = response.data
      })
    },
    onRefreshCaptcha() {
      this.form.pwd.captchaId = uuidv1()
      this.captchaUrl = `${process.env.VUE_APP_BASE_API}/api/auth/captcha/${this.form.pwd.captchaId}`
    },
    onPwdLogin() {
      if (this.verifyPwdLogin()) {
        this.loading = true
        this.$store
          .dispatch('auth/login', this.form.pwd)
          .then(() => {
            this.showCaptcha = false
            this.enter()
          })
          .catch(() => {
            this.showCaptcha = true
            this.loading = false
          })
      }
    },
    onSmsLogin() {
      if (this.verifySmsLogin()) {
        this.loading = true
        const data = { id: this.form.sms.smsCodeId, code: this.form.sms.smsCode, cellphone: this.form.sms.cellphone }
        this.$store
          .dispatch('auth/loginSms', data)
          .then(() => {
            this.showCaptcha = false
            this.enter()
          })
          .catch(() => {
            this.loading = false
          })
      }
    },
    onSendSmsCode() {
      if (this.verifySmsSendCode()) {
        this.form.sms.smsCodeId = uuidv1()
        const data = { id: this.form.sms.smsCodeId, cellphone: this.form.sms.cellphone }
        sendSmsCode(data).then(response => {
          console.log(response.data)
        })
        this.wait()
      }
    },
    async enter() {
      // 这里不直接路由跳转/, 而是先获取登录信息及创建路由,
      // 首次登录完全依赖路由守卫中的判断逻辑, 直接跳转/的话,会导致多次路由中断,出现不友好的错误信息,
      // 当然那也不影响登录使用
      await this.$store.dispatch('auth/profile')
      await this.$store.dispatch('menu/findAuthMenu')
      createDynamicRouter()
      this.$router.push({ path: this.redirect || '/' })
    },
    wait() {
      this.waiting = true
      this.waitText = '60s后获取'
      this.intervalId = setInterval(() => {
        this.lastTime--
        this.waitText = `${this.lastTime}s后获取`
        if (this.lastTime <= 0) {
          clearInterval(this.intervalId) //清除计时器
          this.intervalId = null //设置为null
          this.lastTime = 60
          this.waiting = false
        }
      }, 1000)
    },
    verifyPwdLogin() {
      this.form.pwd.loginName = this.form.pwd.loginName.trim()
      this.form.pwd.captcha = this.form.pwd.captcha.trim()
      if (this.form.pwd.loginName === '') {
        this.$message({
          message: '请填写登录账号',
          type: 'warning'
        })
        return false
      }
      if (this.form.pwd.password === '') {
        this.$message({
          message: '请填写登录密码',
          type: 'warning'
        })
        return false
      }
      if (this.showCaptcha) {
        this.form.pwd.captcha = this.form.pwd.captcha.trim()
        if (this.form.pwd.captcha === '') {
          this.$message({
            message: '请填写图片验证码',
            type: 'warning'
          })
          return false
        }
      }
      return true
    },
    verifySmsLogin() {
      this.form.sms.cellphone = this.form.sms.cellphone.trim()
      this.form.sms.smsCode = this.form.sms.smsCode.trim()
      if (this.form.sms.cellphone === '') {
        this.$message({
          message: '请填写手机号码',
          type: 'warning'
        })
        return false
      }
      if (this.form.sms.smsCode === '') {
        this.$message({
          message: '请填写短信验证码',
          type: 'warning'
        })
        return false
      }
      return true
    },
    verifySmsSendCode() {
      this.form.sms.cellphone = this.form.sms.cellphone.trim()
      if (this.form.sms.cellphone === '') {
        this.$message({
          message: '请填写手机号码',
          type: 'warning'
        })
        return false
      } else {
        return true
      }
    }
  }
}
</script>
<style lang="scss" scoped>
.bg {
  min-height: 100%;
  background-image: url('../../assets/login_images/bg.jpg');
  background-repeat: no-repeat;
  background-size: cover;
}
.login-container {
  background-color: #ffffff66;
  border-radius: 1rem;
  height: 42rem;
  margin-top: 40%;
  box-shadow: 0 0 10px 0 rgba(0, 0, 0, 0.6);
  padding: 1.5rem;
  .login-type-container {
    padding: 1.5rem;
    .login-type {
      font-size: 1.6rem;
      color: $color-font-primary;
      opacity: 0.7;
      &.active {
        border-bottom: 1px solid #333;
        padding-bottom: 1rem;
        font-weight: bold;
        opacity: 1;
      }
    }
  }

  .login-pwd-container,
  .login-sms-container {
    padding: 1.5rem;
    .captcha-img {
      padding: 2px 1px 2px 10px;
      width: 100%;
      height: 40px;
      cursor: pointer;
    }
    .get-smsCode {
      padding-right: 1rem;
      &.waiting {
        color: $color-font-grey;
      }
    }
    .icon-style {
      font-size: 2rem;
    }
    .submit-text {
      font-size: 2rem;
      letter-spacing: 0.5rem;
    }
    .tbar {
      text-align: right;
      .forget-pwd {
        color: $color-font-primary;
      }
    }
  }
}
</style>
