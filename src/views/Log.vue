<template>
  <div class="container container--log">
    <div class="card--log">
      <h1 v-if="mode == 'login'" class="card--log__title">Connexion</h1>
      <h1 v-else class="card--log__title">Inscription</h1>
      <p v-if="mode == 'login'" class="card--log__subtitle">Vous ne possédez pas encore de compte ?<br/><span class="card--log__action" @click="switchToCreate()">Créer un compte</span></p>
      <p v-else class="card--log__subtitle">Vous êtes déjà inscrit ?<br/><span class="card--log__action" @click="switchToLogin()">S'identifier</span></p>
      <div class="log-form">
        <form>
          <input v-model="email" class="log-form__input" id="inputMail" type="email" placeholder="Adresse Email" />
          <input v-model="password" class="log-form__input" type="password" placeholder="Mot de passe" />
        </form>
      </div>
      <div class="container__errorMsg" v-if="status == 'error_user_path'">
        <p class="errorMsg">{{ errorMsg }}</p>
      </div>
      <button @click="login()" @keyup.enter="login()" v-if="mode =='login'" :disabled="!validatedInputs()" class="button button--form">Se connecter</button>
      <button @click="createAccount()" @keyup.enter="createAccount()" v-if="mode =='create'" :disabled="!validatedInputs()" class="button button--form">S'inscrire</button>
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex'
import ButtonView from '@/components/Button.vue'

const mailRegex = /(?:[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*|"(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21\x23-\x5b\x5d-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])*")@(?:(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?|\[(?:(?:(2(5[0-5]|[0-4][0-9])|1[0-9][0-9]|[1-9]?[0-9]))\.){3}(?:(2(5[0-5]|[0-4][0-9])|1[0-9][0-9]|[1-9]?[0-9])|[a-z0-9-]*[a-z0-9]:(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21-\x5a\x53-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])+)\])/


export default {
  name: "LogView",
  data() {
    return {
      mode: 'login',
      email: '',
      password: '',
      errorMsg: ''
    }
  },
  computed: {
    ...mapState(['status', 'user']),
    ButtonView
  },
  methods: {
    validatedInputs() {
      if (mailRegex.test(this.email) && this.password != '') {
        return true
      } else {
        return false
      }
    },
    switchToCreate() {
      this.mode = 'create'
    },
    switchToLogin() {
      this.mode = 'login'
    },
    createAccount() {
      this.$store.dispatch('createAccount', {
        email: this.email,
        password: this.password
      })
        .then(() => this.login())
        .catch((error) => this.errorMsg = error.response.data.message)
    },
    login() {
      this.$store.dispatch('login', {
        email: this.email,
        password: this.password
      })
        .then(() => this.$router.push('home'))
        .catch((error) => this.errorMsg = error.response.data.message)
    }
  },
  mounted() {
    if (this.$store.state.user.userId != '') {
      this.$router.push('home')
    }
  }
}
</script>

<style lang="scss">

.card--log {
  background-color: #4E5166;
  width: 90%;
  box-sizing: border-box;
  padding: 20px;
  border-radius: 10%;
  font-family: Playfair;
  display: flex;
  flex-direction: column;
  align-items: stretch;
  color: white;

  > * {
    flex: 1;
    margin: 10px;
  }

  &__title {
    font-size: 40px;
    font-weight: bold;
  }

  &__subtitle {
    font-size: 25px;
  }

  &__action {
    font-style: italic;
    font-size: 25px;
    text-decoration: underline;

    &:hover {
      cursor: pointer;
    }
  }
}

.log-form form{
  display: flex;
  flex-direction: column;

  input {
    height: 25px;
    border-radius: 10px;
    background-color: #F6F6F6;
    margin: 10px 0;
  }
}

.button {
  background-color: #FD2D01;
  border-radius: 30px;
  color: white;
  cursor: pointer;
  
  &--form {
    font-size: 30px;
  }


  &:disabled {
    background-color: #FFD7D7;
    color: black;
    cursor: not-allowed;
  }


}
</style>