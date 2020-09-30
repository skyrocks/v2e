<template>
  <div class="pwd-wrap">
    <div class="title">修改我的密码</div>
    <PwdForm></PwdForm>
  </div>
</template>

<script>
import PwdForm from './PwdForm'
export default {
  name: 'Pwd',
  components: { PwdForm }
}
</script>

<style lang="scss" scoped>
.pwd-wrap {
  border-radius: 5px;
  box-shadow: 0 0 5px #90939955;
  text-align: center;
  padding: 30px;
  margin: 100px 400px;

  .title {
    line-height: 24px;
    font-size: $size-font-larger;
    color: $color-font-black;
    margin-bottom: 15px;
  }
}
</style>
