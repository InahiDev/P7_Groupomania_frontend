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
    if (this.$store.state.user.userId == '' || this.$store.state.user.token == '') {
      this.$router.push('/')
      return
    }
  }
}
</script>

<style lang="scss">
h2 {
  font-size: 1.5rem;

  @include tablet {
    font-size: 1.8rem;
  }
}
</style>