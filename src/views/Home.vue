<template>
  <BannerView/>
  <section class="container--post">
    <article class="card--post newpost">
      <div class="card--post newpost">
        <div class="car__post__img">
          <div class="card--post__img--added" v-if="this.image != ''">
            <img :src="this.previewImage"/>
            <i id="image-killer" class="fa-solid fa-circle-minus" @click="removeImage"></i> | Supprimer l'image
          </div>  
        </div>
        <input v-model="text" class="newpost--content" type="text" />
        <div class="card--post__img">
          <!--<div class="card--post__img--added" v-if="this.image != ''">
            <img :src="this.previewImage"/>
            <i id="image-uploader" class="fa-solid fa-circle-plus" @click="onUpload"></i><input type="file" id="input__image" class="ring-cross" accept="image/*" ref="image" @change="uploadedFile" />
          </div>-->
          <div class="car--post__img--unloaded" v-if="this.image == ''">
            <i id="image-uploader" class="fa-solid fa-circle-plus" @click="onUpload"></i><input type="file" id="input__image" class="ring-cross" accept="image/*" ref="image" @change="uploadedFile" hidden/>
          </div>
          <ButtonView buttonText="Créer un post" @click="post()"/>
        </div>
      </div>
    </article>
    <div v-for="(post, idx) in posts" :key='idx'>
      <PostView :content="post"/>
    </div>
  </section>
</template>

<script>
import { mapState } from 'vuex'
import BannerView from '@/components/Banner.vue'
import PostView from '@/components/Post.vue'
import ButtonView from '@/components/Button.vue'

export default {
  name: "HomeView",
  data() {
    return {
      text: '',
      image: '',
      previewImage: null,
    }
  },
  mounted() {
    if (this.$store.state.user.userId == '' || this.$store.state.user.token == '') {
      this.$router.push('/')
      return
    }
    this.$store.dispatch('getPosts')
  },
  methods: {
    updateLikesCount() {
      this.content.likes = this.content.usersLiked.length()
    },
    updateDislikeCount() {
      this.content.dislikes = this.content.usersDisliked.length()
    },
    uploadedFile(event) {
      this.image = event.target.files[0]
      let reader = new FileReader
      reader.onload = e => {
        this.previewImage = e.target.result
      }
      reader.readAsDataURL(this.image)
      this.$emit('input', this.image)
  
    },
    removeImage() {
      this.image = ''
    },
    onUpload() {
      let imageInput = document.getElementById('input__image')
      console.log(imageInput)
      imageInput.click()
    },
    post() {
      if (this.text != '') {
        this.$store.dispatch('createPost', {text: this.text, image: this.image})
          .then(this.text = "", this.image = "")
          .then(this.$store.dispatch('getPosts'))
          .then((response) => console.log(response))
          .catch((error) => console.log(error))
      }
    },
  },
  computed: {
    ...mapState(['posts'])
  },
  components: {
    BannerView,
    PostView,
    ButtonView
  }
}

</script>

<style lang="scss">
.card {
  &--post {
    width: 95%;
    background-color: #FFF;
    border-radius: 30px;
    box-sizing: border-box;
    padding: 20px;
    margin: 10px 0;
  
    &__img {
      width: 100%;
    
      img {
        object-fit: contain;
        width: 100%;
      }
    }
  }
}
</style>