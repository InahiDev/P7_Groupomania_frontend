<template>
  <BannerView/>
  <div v-for="(post, idx) in posts" :key='idx' class="card card--post">
    <PostView :content="post" />
  </div>
</template>

<script>
import { mapState } from 'vuex'
import BannerView from '@/components/Banner.vue'
import PostView from '@/components/Post.vue'

export default {
  name: "HomeView",
  mounted() {
    if (this.$store.state.user.userId == '' || this.$store.state.user.token == '') {
      this.$router.push('/')
      return
    }
    this.$store.dispatch('getPosts')
  },
  methods: {
    unlog() {
      this.$store.dispatch('unlog')
      this.$router.push('/')
    }
  },
  computed: {
    ...mapState(['posts'])
  },
  components: {
    BannerView,
    PostView
  }
}

</script>