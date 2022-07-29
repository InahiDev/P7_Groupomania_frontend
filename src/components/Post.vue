<template>
  <section class="posts">
    <article class="card--post">
      <h2>{{ content.text }}</h2>
      <div class="card--post__img" v-if="content.image != ''">
        <img :src="content.image" />
      </div>
      <div class="card--post__like">
        <p><span class="notliked" v-if="liked = 0"><i @click="like()" :disabled="disliked != 0" class="fa-regular fa-thumbs-up"></i></span>
        <span class="Liked" v-else><i @click="neutralLike()" class="fa-regular fa-thumbs-up"></i></span> {{ content.likes }}
         | 
        <span class="notliked" v-if="disliked =0"><i @click="dislike()" :disabled="like != 0" class="fa-regular fa-thumbs-down"></i></span>
        <span class="notliked" v-else><i @click="neutralLike()" :disabled="like != 0" class="fa-regular fa-thumbs-down"></i></span>
         {{ content.dislikes }}</p>
      </div>
      <div class="control" v-if="content.userId == user.userId">
        <ButtonView buttonText="Modifier" />
        <ButtonView buttonText="Supprimer" />
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
      liked: 0,
      disliked: 0,
    }
  },
  props: {
    content: {
      id: Number,
      text: String,
      image: String,
      likes: Number,
      dislikes: Number,
    }
  },
  computed: {
    ...mapState(['user'])
  },
  methods: {
    like() {
      this.liked = 1

      //this.$store.dispatch('likePost', {
      //  like: 1,
      //  id: this.post.id
      //  })
    },
    dislike() {
      this.dislike = 1
      //this.$store.dispatch('likePost', {
      //  like: -1,
      //  id: this.content.id
      //  })
    },
    neutralLike() {
      this.liked = 0
      this.disliked = 0
      this.$store.dispatch('likePost', {
        like: 0,
        id: this.content.id
        })
    }
  }
}
</script>

<style lang="scss">
</style>