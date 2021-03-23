<template>
  <div class="mail-login">
    <van-form @submit="onSubmit">
      <van-field
        v-model="username"
        name="用户名"
        label="用户名"
        placeholder="用户名"
        :rules="[{ required: true, message: '请填写用户名' }]"
      />
      <van-field
        v-model="password"
        type="password"
        name="密码"
        label="密码"
        placeholder="密码"
        :rules="[{ required: true, message: '请填写密码' }]"
      />
      <div style="margin: 16px;">
        <van-button round block type="primary" native-type="submit">提交</van-button>
      </div>
    </van-form>
  </div>
</template>

<script>
import { reactive, toRefs } from 'vue'
import { login } from '@/assets/api/home.js'
export default {
  setup() {
    const state = reactive({
      username: '',
      password: ''
    })
    function onSubmit () {
      login(state).then(res => {
        console.log(res)
      })
    }
    return {
      ...toRefs(state),
      onSubmit
    }
  },
}
</script>