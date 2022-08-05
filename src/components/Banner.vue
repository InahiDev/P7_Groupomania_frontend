<template>
  <header class="banner">
    <div class="container container--banner" v-if="this.$route.name != 'login'">
      <LogoView />
      <ButtonView class="button button--unlog" buttonText="Déconnexion" @click="unlog" @keyup.enter="unlog" />
    </div>
    <NavView v-if="this.$route.name != 'login'"/>
    <h1>Groupomania, Réseau social d'entreprise</h1>
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

<style lang="scss">
.banner {
  @include column;
  @include tablet {
    width: 90%;
  }

  .container--banner {
    @include row(space-between, center);
    box-sizing: border-box;
    padding: 0px 20px;

    .button--unlog {
      width: 30%;
      font-size: 0.8rem;
      border-radius: 10px / 50%;
      @include tablet {
        width: 20%;
      }
    }
    }

  h1 {
    order: 2;
    width: 100%;
    font-size: 1.5rem;
    margin: 25px;
    @include tablet {
      font-size: 2rem;
    }
  }

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

</style>