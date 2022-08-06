<template>
  <button class="button">{{ buttonText }}</button>
</template>

<script>
export default {
  name: "ButtonView",
  props: {
    buttonText: String,
  }
}
</script>

<style lang="scss">
.button {
  width: 100%;
  height: 100%;
  border-radius: 20px / 50%;
  background-color: $color-primary;
  color: #FFF;
  font-size: 1.3rem;
  border: none;
  box-shadow: 2px 2px 5px 2px $color-tertiary;

  &:disabled {
    background-color: $color-secondary;
  }

  @include desktop {
    width: 180px;
    height: 35px;
    font-size: 1.5rem;
  }

}
</style>