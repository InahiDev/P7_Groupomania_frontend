<template>
  <BannerView />
  <div>
    <h2>Bienvenue sur votre page personnelle</h2>
  </div>
  <ProfileView />
</template>

<script>
import BannerView from '../components/Banner.vue'
import ProfileView from '../components/Profile.vue'

export default {
  name: "UserView",
  components: {
    BannerView,
    ProfileView
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

<style lang="scss">
h2 {
  font-size: 1.5rem;
}
</style>