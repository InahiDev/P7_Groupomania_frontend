<template>
  <nav>
        <router-link class="link" to="/home"><i class="fa-solid fa-house"></i> Page d'accueil</router-link> |
        <router-link class="link" to="/user"><i class="fa-solid fa-circle-user"></i> Profil Utilisateur</router-link>

  </nav>
  <router-view/>
</template>

<script>
export default {
  name: "NavView",
}
</script>

<style lang="scss">
nav {
  @include row;
  width: 100%;
  font-size: 1.2rem;
  
  a {
    width: 45%;
    color: $color-tertiary;

    &.router-link-exact-active {
      color: $color-secondary;
    }
  }
}
</style>