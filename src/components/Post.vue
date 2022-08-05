<template>
  <article class="card__article">
    <div class="card__post" v-if="!this.updatingState">
      <p>{{ content.text }}</p>
      <div class="card__post__img" v-if="content.image != null">
        <img :src="content.image" />
      </div>
    </div>
    <div class="card__post--updating" v-if="this.updatingState">
      <textarea class="card__post--updating__content" maxlength="255" :placeholder="content.text" v-model="newText"></textarea>
      <div class="card__post--updating__container" v-if="content.image != ''">
        <div class="card__post--updating__container--updating">
          <span>
            <i class="fa-solid fa-circle-plus" @click="activateImgInput"></i>
            <span v-if="this.changedImg == '' && content.image == null">Ajouter une image</span>
            <span v-if="this.changedImg == '' && content.image != null">Changer d'image</span>
            <span v-if="this.changedImg != '' && content.image != null"> | <i class="fa-solid fa-circle-minus change-cancel" @click="removeImageChanges"></i>Annuler le changement d'image</span>
          </span>
          <span v-if="!this.removeImg && this.content.image != null"><i  class="fa-solid fa-circle-minus change-cancel" @click="removeImage"></i> Supprimer l'image du Post</span>
          <input type="file" class="ring-cross ring-cross--change-img" accept="image/*" ref="image" @change="uploadNewFile" hidden/>
        </div>
        <img class="card__post--updating__container--updating__img" v-if="!hideExistingImage()" :src="content.image" />
        <img class="card__post--updating__container--updating__img" v-else :src="this.previewChangedImg" />
      </div>
    </div>
    <div class="card__post__like">
      <p><span v-if="content.usersLiked.includes(user.userId)" class="liked" :class="{ 'liked--not': !checkLike() }" ><i @click="neutralLike()" class="fa-regular fa-thumbs-up"></i></span>
      <span class="notLiked" v-else><i @click="like()" class="fa-regular fa-thumbs-up"></i></span> {{ content.likes }}
       | 
      <span v-if="content.usersDisliked.includes(user.userId)" class="disliked" :class="{ 'disliked--not': !checkDislike() }"><i @click="neutralLike()" class="fa-regular fa-thumbs-down"></i></span>
      <span class="notLiked" v-else><i @click="dislike()" class="fa-regular fa-thumbs-down"></i></span>
       {{ content.dislikes }}</p>
    </div>
    <div class="control" v-if="content.userId == user.userId || user.isAdmin">
      <ButtonView @click="updatePostState" buttonText="Modifier" v-if="!this.updatingState"/>
      <div class="control--changes" v-else>
        <ButtonView @click="validateUpdate()" buttonText="Confirmer"  />
        <ButtonView @click="cancelUpdateState" buttonText="Annuler" />
      </div>
      <ButtonView @click="deletePost" buttonText="Supprimer" />
    </div>
  </article>
</template>

<script>
import { mapState } from 'vuex'
import ButtonView from './Button.vue'
//import UserPersonnal from './User.vue'

export default {
  name: "PostView",
  components: {
    ButtonView,
    //UserPersonnal
  },
  data() {
    return {
      liked: false,
      disliked: false,
      updatingState: false,
      changedImg: '',
      previewChangedImg: null,
      newText: '',
      removeImg: false,
    }
  },
  props: {
    content: {
      id: Number,
      text: String,
      image: String,
      likes: Number,
      dislikes: Number,
      liked: Boolean,
      disliked: Boolean,
    }
  },
  computed: {
    ...mapState(['user', 'posts']),
  },
  methods: {
    activateImgInput() {
      let changeInput = event.target.closest('div.card__post__img--change').querySelector('input.ring-cross--change-img')
      changeInput.click()
    },
    uploadNewFile(event) {
      this.changedImg = event.target.files[0]
      let reader = new FileReader
      reader.onload = e => {
        this.previewChangedImg = e.target.result
      }
      reader.readAsDataURL(this.changedImg)
      this.$emit('input', this.changedImg)
    },
    updatePostState() {
      this.updatingState = true
    },
    cancelUpdateState() {
      this.updatingState = false
    },
    hideExistingImage() {
      if (this.changedImg !== '' || this.removeImg == true) {
        return true
      } else {
        return false
      }
    },
    removeImageChanges() {
      this.changedImg = ''
      this.previewChangedImg = null
    },
    removeImage() {
      this.removeImg = true
    },
    validateUpdate() {
      if (!this.newText && !this.changedImg && !this.removeImg) {
        this.updatingState = false
        return
      } else {
        if (!this.newText) {
          this.newText = this.content.text
        }
        if (this.content.image) {
          if ((!this.changedImg && !this.removeImg) && this.newText != this.content.text) {
            this.$store.dispatch('updatePostWithImage', {
              id: this.content.id,
              text: this.newText
            })
              .then(response => console.log(response))
              .catch(error => console.log(error))
          } else if (!this.changedImg && this.removeImg) {
            this.$store.dispatch('updatePostWithImage', {
              id: this.content.id,
              text: this.newText,
              image: "killImage"
            })
              .then(response => console.log(response))
              .catch(error => console.log(error))
          } else if (this.changedImg) {
            this.$store.dispatch('updatePostWithImage', {
              id: this.content.id,
              text: this.newText,
              image: this.changedImg
            })
              .then(response => console.log(response))
              .catch(error => console.log(error))
          }
        } else if (!this.content.image) {
          if (!this.changedImg && this.newText !== this.content.text) {
            this.$store.dispatch('updatePostWithoutImage', {
              id: this.content.id,
              text: this.newText,
              image: "",
            })
              .then(response => console.log(response))
              .catch(error => console.log(error))
          } else if (this.changedImg) {
            this.$store.dispatch('updatePostWithoutImage', {
              id: this.content.id,
              text: this.newText,
              image: this.changedImg
            })
              .then(response => console.log(response))
              .catch(error => console.log(error))
          }
        }
        this.newText = ''
        this.updatingState = false
        this.changedImg = '',
        this.previewChangedImg = null,
        this.removeImg = false
      }
    },
    deletePost() {
      if (window.confirm("Êtes-vous sûr de vouloir effacer ce post?")) {
        this.$store.dispatch('deletePost', {id: this.content.id})
      }
    },
    checkLike() {
      this.liked = this.content.usersLiked.includes(this.user.userId)
      return this.liked
    },
    checkDislike() {
      this.disliked = this.content.usersDisliked.includes(this.user.userId)
      return this.disliked
    },
    like() {
      this.liked = true,
      this.disliked = false
      this.$store.dispatch('likePost', {
        like: 1,
        id: this.content.id
      })
        .then(this.checkLike(), this.checkDislike())
        .catch((error) => console.log(error))
    },
    dislike() {
      this.liked = false
      this.disliked = true
      this.$store.dispatch('likePost', {
        like: -1,
        id: this.content.id
      })
        .then(this.checkLike(), this.checkDislike())
        .catch((error) => console.log(error))
    },
    neutralLike() {
      this.liked = false
      this.disliked = false
      this.$store.dispatch('likePost', {
        like: 0,
        id: this.content.id
      })
        .then(this.checkLike(), this.checkDislike())
        .catch((error) => console.log(error))
    }
  }
}
</script>

<style lang="scss">
.card {

  &__article {
    width: 100%;

    .control {
      @include row(space-evenly);

      .button {
        width: 40%;
        font-size: 1rem;
        border-radius: 13px / 50%;
      }
    }
  }

  &__post {
    width: 100%;

    p {
      overflow-wrap: break-word;
    }

    &__img {
      width: 100%;

      img {
        width: 100%;
        object-fit: contain;
      }
    }

    &--updating {
      width: 100%;

      &__content {
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
      }

      &__container {
        width: 100%;

        &--updating {
          width: 100%;
          @include column;
        }
      }
    }

    &__like {
      p {
        margin: 5px 0;
      }

      .liked {
        color: green;

        &--not {
          color: black;
        }
      }

      .disliked {
        color: red;

        &--not {
          color: black;
        }
      }
    }
  }
}
</style>