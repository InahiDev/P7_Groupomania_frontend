<template>
  <aside class="user">
    <div class="user__avatar">
      <i v-if="this.user.avatar == ''" class="fa-solid fa-circle-user"></i>
      <img v-else/>
    </div>
    <h2>{{ this.user.alias }}</h2>
  </aside>
</template>

<script>
import { mapState } from 'vuex'

export default {
  name: "UserPersonnal",
  props: {
    user: {
      alias: String,
      avatar: String
    }
  },
  computed: {
    ...mapState(['user'])
  }
}

</script>