<template>
  <BannerView/>
  <main>
    <section class="section__post">
      <div class="card">
        <article class="card__article card__article--newpost">
          <textarea maxlength="255" v-model="text" class="content" placeholder="Entrez votre nouveau post ici!!!"></textarea>
          <div class="card__article--newpost__img card__article--newpost__img--added" v-if="this.image != ''">
            <img :src="this.previewImage"/>
            <i id="image-killer" class="fa-solid fa-circle-xmark" @click="removeImage"></i> Supprimer l'image
          </div>  
          <div class="card__article--newpost__img">
            <div class="card__article--newpost__img--unloaded" v-if="this.image == ''">
              <i id="image-uploader" class="fa-solid fa-circle-plus" @click="activateUpload"></i> Ajouter une image<input type="file" id="input__image" class="ring-cross" accept="image/*" ref="image" @change="uploadedFile" hidden/>
            </div>
            <ButtonView class="button--create" buttonText="Créer un post" @click="post()"/>
          </div>
        </article>
      </div>
      <div class="card" v-for="(post, idx) in posts" :key='idx'>
        <PostView :content="post"/>
      </div>
    </section>
  </main>
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
    activateUpload() {
      let imageInput = document.getElementById('input__image')
      imageInput.click()
    },
    post() {
      if (this.text != '') {
        console.log('étape n°1 post')
        this.$store.dispatch('createPost', {text: this.text, image: this.image})
          .then(this.text = "", this.image = "")
          .then((response) => console.log(response))
          .catch((error) => console.log(error))
      }
    },
  },
  computed: {
    ...mapState(['posts']),
  },
  components: {
    BannerView,
    PostView,
    ButtonView
  }
}

</script>

<style lang="scss">
main {
  width: 100%;

  .section__post {
    width: 100%;

    .card__article {
      &--newpost {
        
        textarea.content {
          width: 100%;
          height: 100px;
          resize: none;
          box-sizing: border-box;
          padding: 10px;
          text-align: center;
          border-radius: 5px;

          &::placeholder {
            text-justify: center;
          }

          @include desktop {
            font-size: 1.5rem;
          }
        }

        &__img {
          width: 100%;
          margin: 0;
          @include desktop {
            font-size: 1.5rem;
          }

          &--added {
            img {
              width: 100%;
              object-fit: contain;
            }
            i {
              margin: 5px;
            }
          }

          &--unloaded {
            margin: 5px 0;          
          }

          .button--create {
            width: 60%;
            border-radius: 15px / 50%;
            margin: 10px 0 0 0;

            @include tablet {
              width: 40%;
            }
            @include desktop {
              width: 180px;
              font-size: 1.5rem;
            }
          }
        }

      }
    }
  }
}
</style>