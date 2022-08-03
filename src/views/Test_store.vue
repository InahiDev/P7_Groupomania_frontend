  <nav>
    <router-link to="/">Home</router-link> |
    <router-link to="/about">About</router-link>
  </nav>
  <router-view/>



<script>
validateUpdate() {
  //Mentorat Fabien idée de reconception de la fonction

  // Premier if !this.newText
// => !this.changedImg === return
// => !this.changedImg && this.removeImg => appel API suppression image
// => this.changedImg => envoi au back update image only
// Second cas newText existe
// => !this.changedImage && !this.removeImg => Appel API textUpdateOnly
// => !this.changedImage 
//



</script>


  <!--<template>
  <div class="log-form">
    <form>
      <input v-model="email" class="log-form__input" id="inputMail" type="email" placeholder="Adresse Email" />
      <input v-model="password" class="log-form__input" type="password" placeholder="Mot de passe" />
    </form>
  </div>
</template>

<script>
//const emailRegex = /(?:[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*|"(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21\x23-\x5b\x5d-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])*")@(?:(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?|\[(?:(?:(2(5[0-5]|[0-4][0-9])|1[0-9][0-9]|[1-9]?[0-9]))\.){3}(?:(2(5[0-5]|[0-4][0-9])|1[0-9][0-9]|[1-9]?[0-9])|[a-z0-9-]*[a-z0-9]:(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21-\x5a\x53-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])+)\])/


//export default {
//  name: "LogForm",
//  data() {
//    return {
//      email: '',
//      password: ''
//    }
//  },
//  methods: {
//    validateEmail() {
//      if (document.getElementById("inputEmail").hasAttribute('valid')) {
//        return true
//      } else {
//        return false
//      }
//    }
//  }
//}
</script>

<style lang="scss" scoped>
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

</style>-->