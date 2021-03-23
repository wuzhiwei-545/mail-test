<template>
  <div class="home">
    <ul class="mail-list">
      <li v-for="item in list" :key="item.seqno" @click="onShowDetail(item.seqno)">
        <div class="mail-img">{{item.iconTxt}}</div>
        <div class="mail-msg">
          <div class="mail-name-date">
            <p>{{item.from}}</p>
            <span>{{item.date}}</span>
          </div>
          <p>{{item.subject}}</p>
          <a :href="item.fileUrl" target="_blank" v-if="item.fileUrl">{{item.filename}}</a>
        </div>
      </li>
    </ul>
    <van-icon name="add" size="50" color="#000" class="send-icon" @click="$router.push('/send')" />
  </div>
</template>

<script>
import { reactive, toRefs, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useStore } from 'vuex'
export default {
  setup() {
    const router = useRouter()
    const store = useStore()
    const state = reactive({
      list: []
    })
    onMounted(async () => {
      await store.dispatch('setMailList')
      state.list = store.state.mailList
    })

    function onShowDetail (seqno) {
      router.push(`/detail/${seqno}`)
    }
    return {
      ...toRefs(state),
      onShowDetail
    }
  },
}
</script>

<style>
body, div, p, ul, li {
  margin: 0;
  padding: 0;
}
.home .mail-list {
  width: 100%;
}
.mail-list li {
  width: 100%;
  display: flex;
}
.mail-img {
  width: 100px;
  height: 100px;
  margin: 10px;
  line-height: 100px;
  text-align: center;
  border-radius: 50px;
  background-color: rgb(25, 137, 250);
  color: #fff;
}
.mail-msg {
  padding: 10px;
  text-align: left;
  flex: 1;
  border-bottom: 1px solid #000;
}
.mail-msg p {
  width: 400px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
.mail-name-date {
  display: flex;
  justify-content: space-between;
}
.send-icon {
  width: 100px;
  height: 100px;
  position: fixed;
  right: 20px;
  bottom: 30px;
}
</style>