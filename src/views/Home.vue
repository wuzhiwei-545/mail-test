<template>
  <div class="home">
    <div class="form-item">
      <label>收件人</label>
      <input type="text" v-model="mailInfo.recipient" />
    </div>
    <div class="form-item">
      <label>主题</label>
      <input type="text" v-model="mailInfo.theme" />
    </div>
    <div class="form-item">
      <label>正文</label>
      <textarea id="" cols="30" rows="3" v-model="mailInfo.content"></textarea>
    </div>

    <button @click="sendMessage">发送</button>
    <br />
    <router-link to="/inbox">收件箱</router-link>
  </div>
</template>

<script>
import { reactive, toRaw } from 'vue'
import { sendMsg } from '@/assets/api/home.js'
export default {
  name: 'Home',
  setup () {
    let mailInfo = reactive({ 
      recipient: '',
      theme: '',
      content: ''
    })

    function sendMessage () {
      const obj = toRaw(mailInfo)
      sendMsg(obj).then(() => {
        alert('成功')
      })
    }
    return {
      mailInfo,
      sendMessage
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
h3 {
  margin: 40px 0 0;
}
ul {
  list-style-type: none;
  padding: 0;
}
li {
  display: inline-block;
  margin: 0 10px;
}
a {
  color: #42b983;
}
</style>
