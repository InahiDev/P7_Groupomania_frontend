<template>
  <BannerView />
  <div>
    <h1>Bienvenue sur votre page personnelle</h1>
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
  }
}
</script>