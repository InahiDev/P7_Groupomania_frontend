<template>
  <nav>
    <router-link to="/">Page d'accueil</router-link> | 
    <router-link to="/user">Profil</router-link>
  </nav>
  <router-view/>
</template>

<script>
export default {
  name: "NavView",
}
</script>

<style lang="scss" scopped>
nav {
  display: flex;
  width: 100%;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  padding: 30px;

  a {
    font-weight: bold;
    color: #2c3e50;

    &.router-link-exact-active {
      color: #42b983;
    }
  }

}

</style>