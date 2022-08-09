<template>
  <article @click="showControls" class="card__article">
    <div class="card__post" v-if="!this.updatingState">
      <p>{{ content.text }}</p>
      <div class="card__post__img" v-if="content.image != null">
        <img :src="content.image" />
      </div>
    </div>
    <div class="card__post--updating" v-if="this.updatingState">
      <textarea class="card__post--updating__content" maxlength="255" :placeholder="content.text" v-model="newText"></textarea>
      <div class="card__post--updating__container" v-if="content.image != ''">
        <img class="card__post--updating__container--updating__img" v-if="!hideExistingImage()" :src="content.image" />
        <img class="card__post--updating__container--updating__img" v-else :src="this.previewChangedImg" />
        <div class="card__post--updating__container--updating__controls">
          <p>
            <i class="fa-solid fa-circle-plus control-icons" @click="activateImgInput" v-if="plusButtonShow()"></i>
            <span v-if="addAnImage()"> Ajouter une image</span>
            <span v-if="changeImage()"> Changer d'image</span>
          </p>
          <p>
            <span v-if="this.changedImg && content.image"><i class="fa-solid fa-circle-xmark control-icons" @click="removeImageChanges"></i> Annuler le changement d'image</span>
          </p>
          <p>
            <span v-if="removeImageFromPost()"><i class="fa-solid fa-circle-minus control-icons" @click="removeImage"></i> Supprimer l'image du post</span>
            <span v-if="this.removeImg"><i class="fa-solid fa-circle-xmark control-icons" @click="cancelRemoveImage"></i> Annuler la suppression d'image</span>
          </p>
          <input type="file" class="input-img" accept="image/*" ref="image" @change="uploadNewFile" hidden/>
        </div>
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
    <div class="control" v-if="(content.userId == user.userId || user.isAdmin) && this.controls">
      <ButtonView @click="updatePostState" buttonText="Modifier" v-if="!this.updatingState"/>
      <div class="control--changes" v-else>
        <ButtonView @click="validateUpdate()" buttonText="Confirmer"  />
        <ButtonView @click="cancelUpdateState()" buttonText="Annuler" />
      </div>
      <ButtonView v-if="!this.updatingState" @click="deletePost" buttonText="Supprimer" />
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
      previewChangedImgCache: null,
      newText: '',
      removeImg: false,
      controls: false,
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
    showControls() {
      this.controls = true
    },
    plusButtonShow() {
      if (this.content.image && this.changedImg) {
        if (this.removeImg) {
          return true
        } else {
          return false
        }
      } else {
        return true
      }
    },
    //(content.image == null || this.changedImg == '') || (content.image && this.removeImg && this.changedImg)
    addAnImage() {
      if (!this.changedImg) {
        if(this.removeImg) {
          return true
        } else {
          if (!this.content.image) {
            return true
          }
        }
      } else {
        return false
      }
    }, // (this.changedImg == '' && content.image == null && this.removeImg) || (this.changedImg == '' && content.image != null && this.removeImg) || (content.image == null && this.changedImg == '' && !this.removeImg)
    changeImage() {
      if (!this.removeImg) {
        if (this.changedImg) {
          return true
        } else {
          if (this.content.image) {
            return true
          } else {
            return false
          }
        }
      } else {
        if (this.changedImg) {
          return true
        } else {
          return false
        }
      }
    },
    //((this.changedImg != '' && content.image == null) || (this.changedImg == '' && content.image != null)) && !this.removeImg
    removeImageFromPost() {
      if (this.content.image) {
        if (!this.removeImg) {
          return true
        } else {
          return false
        }
      } else {
        if (this.changedImg) {
          return true
        } else {
          return false
        }
      }
    },
    //(!this.removeImg && this.content.image != null) || (content.image == null && changedImg != '')
    activateImgInput() {
      event.stopPropagation()
      let changeInput = event.target.closest('div.card__post--updating__container--updating__controls').querySelector('input.input-img')
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
      event.stopPropagation()
      this.updatingState = true
    },
    cancelUpdateState() {
      event.stopPropagation()
      this.updatingState = false
      this.removeImg = false
      this.changedImg = ''
      this.previewChangedImg = null
      this.controls = false
    },
    hideExistingImage() {
      if (this.changedImg !== '' || this.removeImg == true) {
        return true
      } else {
        return false
      }
    },
    removeImageChanges() {
      event.stopPropagation()
      this.changedImg = ''
      this.previewChangedImg = null
    },
    removeImage() {
      event.stopPropagation()
      this.removeImg = true
      this.previewChangedImgCache = this.previewChangedImg
      this.previewChangedImg = null
      this.changedImg = ''
    },
    cancelRemoveImage() {
      event.stopPropagation()
      this.removeImg = false
      this.previewChangedImg = this.previewChangedImgCache
      this.changedImg = ''
    },
    validateUpdate() {
      event.stopPropagation()
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
        this.changedImg = ''
        this.previewChangedImg = null
        this.removeImg = false
        this.controls = false
      }
    },
    deletePost() {
      if (window.confirm("Êtes-vous sûr de vouloir effacer ce post?")) {
        this.$store.dispatch('deletePost', {id: this.content.id})
      } else {
        event.stopPropagation()
        this.controls = false
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
      event.stopPropagation()
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
      event.stopPropagation()
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
      event.stopPropagation()
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
    margin: none;
    @include column;
    box-sizing: border-box;

    .control {
      @include row(space-evenly);
      width: 100%;
      margin-top: 15px; 
      height: 30px;

      &--changes {
        width: 100%;
        @include row(space-evenly);
        margin-top: 15px;
        height: 30px;
      }

      .button {
        width: 40%;
        font-size: 1rem;
        border-radius: 13px / 50%;
      }

      @include tablet {
        width: 70%;
      }

      @include desktop {
        width: 70%;
        margin-top: 0;

        .button {
          width: 180px;
          height: 35px;
          font-size: 1.5rem;
        }
      }
    }

    @include desktop {
      font-size: 1.5rem;
    }
  }

  &__post {
    width: 100%;
    box-sizing: border-box;


    p {
      margin-top: 0;
      margin-bottom: 20px;
      overflow-wrap: break-word;
      @include desktop {
        font-size: 1.8rem;
      }
    }

    &__img {
      display: flex;
      width: 100%;

      img {
        box-sizing: border-box;
        width: 100%;
        height: auto;
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
        @include desktop {
          font-size: 1.5rem;
        }
        &::placeholder {
          text-justify: center;
          @include desktop {
            font-size: 1.5rem;
          }
        }
      }

      &__container {
        width: 100%;

        @include desktop {
          height: auto;
        }

        &--updating {
          width: 100%;
          @include column;

          &__controls {
            @include desktop {
              p {
                font-size: 2rem;
              }
            }
          }

          &__img {
            width: 100%;
            object-fit: contain;
          }
        }
      }
    }

    &__like {
      p {
        margin: 15px 0 0 0;
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
      @include desktop {
        p {
          font-size: 2rem;
          margin-bottom: 15px;

          i {
            font-size: 2rem;
          }
        }


      }
    }
  }
}
</style>