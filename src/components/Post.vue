<template>
  <h2>{{ content.text }}</h2>
  <div class="card--post__img" v-if="content.image != ''">
    <img :src="content.image" />
  </div>
  <div class="card--post__like">
    <p><i class="fa-regular fa-thumbs-up"></i> {{ content.likes }} | <i class="fa-regular fa-thumbs-down"></i> {{ content.dislikes }} </p>
  </div>
</template>

<script>
export default {
  name: "PostView",
  props: {
    content: {
      id: Number,
      text: String,
      image: String,
      likes: Number,
      dislikes: Number,
    }
  }
}
</script>