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

<style lang="scss" scoped>
button {
  background-color: #FD2D01;
  border-radius: 30px;
  color: white;
  cursor: pointer;

  &:disabled {
    background-color: #FFD7D7;
    color: black;
    cursor: not-allowed;
  }

  &--form {
    font-size: 30px;
  }
}

</style>