<template>
  <BannerView />
  <main>
    <div class="card">
      <h2>Erreur 404 - La page que vous cherchez n'existe pas!</h2>
    </div>
  </main>
</template>

<script>
import BannerView from '../components/Banner.vue'

export default {
  name: "NotFound",
  components: {
    BannerView,
  },
  mounted() {
    if (this.$store.state.user.userId == '' || this.$store.state.user.token == '') {
      this.$router.push('/')
      return
    }
  }
}
</script>