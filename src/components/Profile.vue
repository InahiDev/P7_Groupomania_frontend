<template>
  <div class="card">
    <section class="user">
      <div class="user__avatar">
        <img />
      </div>
      <div class="user__info">
        <p class="user__info__name">Votre pseudonyme : {{ this.name }}</p>
        <label name="name">Changez votre pseudonyme ici :</label>
        <input v-model="name" name="name" type="text" min="2" max="20" class="user__input user__input--name" />
        <p class="user__info__email">Votre adresse mail : {{ this.user.email }} </p>        
      </div>
      <div class="user__delete">
        <h2>Supprimer votre compte :</h2>
        <ButtonView buttonText="Suppression" />
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