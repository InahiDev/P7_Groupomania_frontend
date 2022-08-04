<template>
  <div class="card">
    <section class="user">
      <div class="user__delete">
        <h2>Supprimer votre compte</h2>
        <ButtonView class="button--delete" buttonText="Suppression" />
      </div>
    </section>
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
  .button--delete {
    width: 70%;
    height: 30px;
    border-radius: 15px / 50%;
  }
}

</style>