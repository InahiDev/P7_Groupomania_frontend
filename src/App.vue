<template>
  <router-view />
</template>

<script>
</script>

<style lang="scss">
body {
  background-image: linear-gradient(60deg, $color-primary 0%, $color-secondary 100%);
  background-attachment: fixed;
  box-sizing: border-box;
  margin: 0;
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
}

.card {
  background-color: #FFF;
  width: 90%;
  box-sizing: border-box;
  margin: 5% auto;
  padding: 30px;
  border-radius: 30px;
  box-shadow: 2px 2px 10px 2px $color-tertiary;

  @include tablet {
    width: 70%
  }
}
</style>
