<template>
  <div class="home">
    <router-link to="/">收件箱</router-link>
    <van-form @submit="onSubmit">
      <van-field
        v-model="mailInfo.recipient"
        name="收件人"
        label="收件人"
        placeholder="收件人"
      />
      <van-field
        v-model="mailInfo.theme"
        name="主题"
        label="主题"
        placeholder="主题"
      />
      <van-field
        v-model="mailInfo.content"
        rows="5"
        autosize
        label="正文"
        type="textarea"
      />
      <van-field name="uploader" label="附件">
        <template #input>
          <van-uploader v-model="mailInfo.file" :after-read="afterRead">
            <van-button icon="plus" type="primary">上传文件</van-button>
          </van-uploader>
        </template>
      </van-field>
      <div style="margin: 16px;">
        <van-button round block type="primary" native-type="submit">发送</van-button>
      </div>
    </van-form>
  </div>
</template>

<script>
import { reactive, toRaw } from 'vue'
import { sendMsg } from '@/assets/api/home.js'
import axios from 'axios'
export default {
  name: 'Home',
  setup () {
    let mailInfo = reactive({ 
      recipient: '',
      theme: '',
      content: '',
      annexs: []
    })

    function onSubmit () {
      const {recipient, theme, content, annexs} = toRaw(mailInfo)
      sendMsg({recipient, theme, content, annexs}).then(() => {
        alert('成功')
      })
    }

    function afterRead (file) {
      let formData = new FormData()
      formData.append('avatar', file.file)
      console.log('formData', formData.get('avatar'))
      axios({
        url: 'http://localhost:8080/api/upload',
        method: 'POST',
        data: formData
      }).then(res => {
        mailInfo.annexs.push({
          filename: res.data.name,
          path: res.data.url
        })
      })
      // upload(formData).then(res => {
      //   console.log(res)
      // })
    }
    return {
      mailInfo,
      onSubmit,
      afterRead
    }
  }
}
</script>
