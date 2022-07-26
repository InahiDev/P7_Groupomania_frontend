<template>
  <router-view />
</template>

<script>
</script>

<style lang="scss">

body {
  background-image: linear-gradient(60deg, $color-secondary 0%, $color-primary 100%);
  background-attachment: fixed;
  width: 97%;
}

#app {
  font-family: Lato, Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  width: 100%;
  @include column;
}

.container {
  width: 100%;
  height: 97vh;

  &--log {
    display: flex;
    justify-content: center;
    align-items: center;
  }
}

</style>
