<template>
  <section class="posts">
    <article class="card--post">
      <h2>{{ content.text }}</h2>
      <div class="card--post__img" v-if="content.image != ''">
        <img :src="content.image" />
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
        <ButtonView @click="updatePost" buttonText="Modifier" />
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
  mounted() {
    this.$store.dispatch('getPosts')
  },
  data() {
    return {
      liked: false,
      disliked: false,
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