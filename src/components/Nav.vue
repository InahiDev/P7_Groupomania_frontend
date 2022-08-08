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

  @include tablet {
    width: 50%;
    position: absolute;
    top: 50px;
    left: 22%;
    font-size: 1.2rem;
  }
  @include desktop {
    width: 50%;
    position: absolute;
    top: 90px;
    left: 28%;
    font-size: 1.3rem;
  }
  
  a {
    width: 45%;
    color: $color-tertiary;

    @include tablet {
      width: 100%;
    }

    &.router-link-exact-active {
      color: $color-secondary;
    }
  }
}
</style>