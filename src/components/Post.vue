<template>
  <section class="posts">
    <article class="card--post">
      <div class="post" v-if="!this.updatingState">
        <p>{{ content.text }}</p>
        <div class="card--post__img" v-if="content.image != ''">
          <img :src="content.image" />
        </div>
      </div>
      <div class="post" v-if="this.updatingState">
        <input type="text" :placeholder="content.text" multiligne>
        <div class="card--post__img" v-if="content.image != ''">
          <div class="card--post__img--change">
            <i class="fa-solid fa-circle-plus" @click="activateImgInput"></i><input type="file" class="ring-cross ring-cross--change-img" accept="image/*" ref="image" @change="uploadNewFile" hidden/>
          </div>
          <img v-if="this.changedImg == ''" :src="content.image" />
          <img v-else :src="this.previewChangedImg" />
        </div>
      </div>
      <div class="card--post__like">
        <p><span v-if="content.usersLiked.includes(user.userId)" class="liked" :class="{ 'liked--not': !checkLike() }" ><i @click="neutralLike()" class="fa-regular fa-thumbs-up"></i></span>
        <span class="notLiked" v-else><i @click="like()" class="fa-regular fa-thumbs-up"></i></span> {{ content.likes }}
         | 
        <span v-if="content.usersDisliked.includes(user.userId)" class="disliked" :class="{ 'disliked--not': !checkDislike() }"><i @click="neutralLike()" class="fa-regular fa-thumbs-down"></i></span>
        <span class="notLiked" v-else><i @click="dislike()" class="fa-regular fa-thumbs-down"></i></span>
         {{ content.dislikes }}</p>
      </div>
      <div class="control" v-if="content.userId == user.userId">
        <ButtonView @click="updatePostState" buttonText="Modifier" v-if="!this.updatingState"/>
        <div class="control--changes" v-else>
          <ButtonView @click="validateUpdate" buttonText="Confirmer"  />
          <ButtonView @click="cancelUpdateState" buttonText="Annuler" />
        </div>
        <ButtonView @click="deletePost" buttonText="Supprimer" />
      </div>
    </article>
  </section>
</template>

<script>
import { mapState } from 'vuex'
import ButtonView from './Button.vue'

export default {
  name: "PostView",
  components: {
    ButtonView
  },
  data() {
    return {
      liked: false,
      disliked: false,
      updatingState: false,
      changedImg: '',
      previewChangedImg: null,
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
    ...mapState(['user', 'posts'])
  },
  methods: {
    activateImgInput() {
      let changeInput = event.target.closest('div.card--post__img--change').querySelector('input.ring-cross--change-img')
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
    validateUpdate() {

    },
    deletePost() {
      if (window.confirm("Êtes-vous sûr de vouloir effacer ce post?")) {
        this.$store.dispatch('deletePost', {id: this.content.id})
      } else {
        return
      }
    },
    checkLike() {
      if (this.content.usersLiked.includes(this.user.userId)) {
        this.liked = true
        return true
      } else {
        this.liked = false
        return false
      }
    },
    checkDislike() {
      if (this.content.usersDisliked.includes(this.user.userId)) {
        this.disliked = true
        return true
      } else {
        this.disliked = false
        return false
      }
    },
    like() {
      this.liked = true,
      this.disliked = false
      this.$store.dispatch('likePost', {
        like: 1,
        id: this.content.id
        })
        .then(this.checkLike(), this.checkDislike())
        //.then(this.$store.dispatch('getOnePost', { id: this.content.id }))
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
        //.then(this.$store.dispatch('getOnePost', { id: this.content.id }))
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
        //.then(this.$store.dispatch('getOnePost', { id: this.content.id }))
        .catch((error) => console.log(error))
    }
  }
}
</script>

<style lang="scss">

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


</style>