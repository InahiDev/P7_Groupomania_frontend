<template>
  <BannerView class="banner--log" />
  <div class="container container--log">
    <div class="card card--log">
      <h2 v-if="mode == 'login'" class="card--log__title">Connexion</h2>
      <h2 v-else class="card--log__title">Inscription</h2>
      <p v-if="mode == 'login'" class="card--log__subtitle">Vous ne possédez pas encore de compte ?<br/><span class="card--log__action" @click="switchToCreate()">Créer un compte</span></p>
      <p v-else class="card--log__subtitle">Vous êtes déjà inscrit ?<br/><span class="card--log__action" @click="switchToLogin()">S'identifier</span></p>
      <div class="log-form">
        <form>
          <input v-model="email" class="log-form__input" id="inputMail" type="email" placeholder="Adresse Email" />
          <input v-model="password" class="log-form__input" type="password" placeholder="Mot de passe" />
        </form>
      </div>
      <div class="container__errorMsg" v-if="mode == 'login' && status == 'error_user_path--login'">
        <p class="errorMsg">{{ errorMsg }}</p>
      </div>
      <div class="container container__errorMsg" v-if="mode == 'create' && status == 'error_user_path--signin'">
        <p class="errorMsg">{{ errorMsg }}</p>
      </div>
      <div class="container card--log__button">
        <ButtonView buttonText="Se connecter" @click="login()" @keyup.enter="login()" v-if="mode =='login'" :disabled="!validatedInputs()" class="button--form" />
        <ButtonView buttonText="S'enregistrer" @click="createAccount()" @keyup.enter="createAccount()" v-if="mode =='create'" :disabled="!validatedInputs()" class="button--form" />
      </div>
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex'
import ButtonView from '@/components/Button.vue'
import BannerView from '@/components/Banner.vue'

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
    ...mapState(['status', 'user'])
  },
  components: {
    ButtonView,
    BannerView
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
      this.$store.state.status = ''
    },
    switchToLogin() {
      this.mode = 'login'
      this.$store.state.status = ''
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
      return
    }


    //if (this.$store.state.status != 'logedIn') {
    //  let user = localStorage.getItem('user')
    //  if (!user) {
    //    user =  {
    //      userId: '',
    //      token: '',
    //      isAdmin: false,
    //      email: ''
    //    }
    //    this.$store.state.user = user
    //    this.$store.state.status = ''
    //  } else {
    //    try {
    //      let userRelog = JSON.parse(user)
    //      this.$store.dispatch('relog', userRelog)
    //        .then(this.$router.push('home'))
    //    } catch(exception) {
    //      user = {
    //        userId: '',
    //        token: '',
    //        isAdmin: false,
    //        email: ''
    //      }
    //      this.$store.state.user = user
    //      this.$store.state.status = ''
    //    }
    //  }
    //} else {
    //  this.$router.push('home')
    //}



    //let user = localStorage.getItem('user')
    //if (!user) {
    //  this.$store.state.user =  {
    //    userId: '',
    //  token: ''
    //  }
    //} else {
    //  this.$store.state.user = JSON.parse(user)
    //}
    //if (this.$store.state.user.userId != '') {
    //  this.$router.push('home')
    //}
  }
}
</script>

<style lang="scss">
.banner--log {
  margin-top: 50px;

  @include tablet {
    margin-top: 30px;
  }
  @include desktop {
    margin-top: 100px;
    margin-bottom: 100px;
  }

  h1 {
    margin: 0;
    @include desktop {
      font-size: 3rem;
    }
  }
}

.container--log {
  @include column;
}

.card--log {
  @include column(space-around);
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  &__title {
    margin: 0 0 20px 0;
    text-shadow: 2px 2px 10px $color-tertiary;
  }
  &__subtitle {
    margin: 0;
    font-size: 1.4rem;
  }
  &__action {
    display: block;
    margin: 10px 0;
    font-size: 1.3rem;
    text-decoration: underline;
    color: $color-primary;
  }
  &__button {
    height: 30px;
    margin-top: 5px;
  }
  @include tablet {
    &__title {
      font-size: 3rem;
    }
    &__subtitle {
      font-size: 2rem;
    }
    &__action {
      font-size: 1.9rem 
    }
    &__button {
      height: 50px;
      margin-top: 13px;
    }
  }
  @include desktop {

    &__title {
      font-size: 2rem;
    }
    &__subtitle {
      font-size: 1.6rem;
    }
    &__action {
      font-size: 1.5rem;
    }
    &__button {
      width: 50%;
      height: 40px; 
      .button--form {
        font-size: 1.7rem;
      }
    }
  }
}

.log-form {
  @include column;
  width: 100%;

  form {
    height: 85px;
    width: 100%;
    margin-bottom: 20px;
    @include column(space-between, center)
  }

  &__input {
    margin: 5px 0;
    box-sizing: border-box;
    width: 100%;
    height: 30px;
    background-color: #F6F6F6;
    border: 0 solid black;
    padding: 0 10px;
    border-radius: 25px;
    box-shadow: 2px 2px 5px 2px #777;
  }

  @include tablet {
    form {
      height: 120px;
    }

    &__input {
      margin: 10px 0;
      height: 50px;
      padding: 0 20px;
      font-size: 1.5rem;
    }
  }
  @include desktop {
    form {
      height: 130px;
      margin-bottom: 20px
    }
    &__input {
      width: 70%;
      height: 50px;
      font-size: 1.3rem;
      padding: 0 25px;
    }
  }
}

.errorMsg {
  margin: 0;
  font-size: 1.2rem;

  @include tablet {
    font-size: 1.5rem;
  }

  @include desktop {
    font-size: 1.5rem;
  }

}

</style>