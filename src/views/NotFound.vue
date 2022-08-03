<template>
  <BannerView />
  <div>
    <h1>Erreur 404 - La page que vous cherchez n'existe pas!</h1>
  </div>
</template>

<script>
import BannerView from '../components/Banner.vue'

export default {
  name: "NotFound",
  components: {
    BannerView,
  }
}
</script>