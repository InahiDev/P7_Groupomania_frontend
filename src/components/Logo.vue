<template>
  <div class="div-logo">
    <img src="../assets/icon-left-font-monochrome-white.png" alt="Logo Groupomania" />
  </div>
</template>

<script>
export default {
  name: "LogoView"
}
</script>

<style lang="scss" scopped>
.div-logo {
  width: 200px;
  height: 200px;

  img {
    width: 100%;
    height: 100%;
    object-fit: contain;
  }
}
</style>