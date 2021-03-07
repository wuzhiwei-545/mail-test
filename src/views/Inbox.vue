<template>
  <div class="inbox" v-html="msgHtml"></div>
</template>

<script>
import { reactive, toRefs, onMounted } from 'vue'
import { getMsg } from '@/assets/api/home.js'
export default {
  setup() {
    const msgInfo = reactive({
      msgHtml: ''
    })
    onMounted(() => {
      getMsg().then(res => {
        msgInfo.msgHtml = res
      })
    })
    return {
      ...toRefs(msgInfo)
    }
   }
}
</script>