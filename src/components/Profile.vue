<template>
  <div class="card">
    <div class="user__delete">
      <h3>Supprimer votre compte</h3>
      <ButtonView class="button--delete" buttonText="Suppression" />
    </div>
  </div>
</template>

<script>
import ButtonView from './Button.vue'
import { mapState } from 'vuex'

export default {
  name: "ProfileView",
  data() {
    return {
      name: ''
    }
  },
  methods: {

  },
  components: {
    ButtonView
  },
  computed: {
    ...mapState(['user'])
  }
}

</script>

<style lang="scss">
.user__delete {

  h3 {
    margin: 0 0 15px 0;
    font-size: 1.3rem;
  }

  .button--delete {
    width: 70%;
    height: 30px;
    border-radius: 15px / 50%;
  }

  @include tablet {
    h3 {
      font-size: 1.6rem;
    }
    .button--delete {
      width: 50%;
    }
  }
}

</style>