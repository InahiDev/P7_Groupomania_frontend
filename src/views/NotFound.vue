<template>
  <BannerView />
  <main>
    <div>
      <h1>Erreur 404 - La page que vous cherchez n'existe pas!</h1>
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
    let user = localStorage.getItem('user')
    if (!user) {
      this.$store.state.user =  {
        userId: '',
      token: ''
      }
    } else {
      this.$store.state.user = JSON.parse(user)
      this.$store.state.status = "logedIn"
    }
  }
}
</script>