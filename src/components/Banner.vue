<template>
  <header class="banner">
    <LogoView />
    <h1>Groupomania, Réseau social d'entreprise</h1>
    <div class="nav-unlog">
      <NavView />
      <ButtonView buttonText="Déconnexion" @click="unlog" @keyup.enter="unlog" />
    </div>
  </header>
</template>

<script>
import NavView from './Nav.vue'
import LogoView from './Logo.vue'
import ButtonView from './Button.vue'

export default {
  name: "BannerView",
  components: {
    NavView,
    LogoView,
    ButtonView
  },
  methods: {
    unlog() {
      this.$store.dispatch('unlog')
      this.$router.push('/')
    }
  }
}
</script>

<style lang="scss" scopped>
.banner {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;


  @include desktop {
    display: flex;
    width: 100%;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
    box-sizing: border-box;
    padding: 0 50px;
  } 
}

.nav-unlog {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  width: 13%;
}


</style>