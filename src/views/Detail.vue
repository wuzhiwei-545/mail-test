<template>
  <div class="mail-detail">
    <div v-html="mailInfo.html"></div>
    <a :href="mailInfo.fileUrl" target="_blank" v-if="mailInfo.fileUrl">{{mailInfo.filename}}</a>
  </div>
</template>

<script>
import { computed } from 'vue'
import { useStore } from 'vuex'
import { useRoute } from 'vue-router'
export default {
  setup() {
    const store = useStore()
    const route = useRoute()
    let mailInfo = computed(() => {
      return store.state.mailList.filter(({seqno}) => { return seqno == route.params.seqno })[0]
    })
    return { mailInfo }
  },
}
</script>