<template>
  <div class="container container--logo">
    <img src="../assets/icon-left-font-monochrome-white.png" alt="Logo Groupomania" />
  </div>
</template>

<script>
export default {
  name: "LogoView"
}
</script>

<style lang="scss">
.container--logo {
  width: 80px;
  position: relative;
  top: 5px;

  img {
    width: 100%;
    object-fit: contain;
  }
  @include tablet {
    width: 120px;
  }
  @include desktop {
    width: 200px;
  }
}
</style>