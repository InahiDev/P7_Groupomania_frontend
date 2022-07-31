import { createStore } from 'vuex'



const axios = require('axios')
const instance = axios.create({
  baseURL: 'http://localhost:3000/api'
})

const unlogUser = {
  userId: '',
  token: '',
}

let user = localStorage.getItem('user')
if (!user) {
  user = unlogUser
} else {
  user = JSON.parse(user)
  instance.defaults.headers.common['Authorization'] = `Bearer ${user.token}`
}


export default createStore({
  state: {
    status: '',
    user: {
      userId: '',
      token: '',
      email: '',
      alias: '',
    },
    newPost: {
      text: '',
      image: '',
    },
    posts: [],
  },
  getters: {
  },
  mutations: {
    setStatus(state, status) {
      state.status = status
    },
    registerEmail(state, email) {
      state.user.email = email
    },
    log(state, user) {
      state.user = user
      instance.defaults.headers.common['Authorization'] = `Bearer ${user.token}`
      localStorage.setItem('user', JSON.stringify({user: user.userId, token: user.token}))
    },
    unlog(state) {
      localStorage.removeItem('user')
      state.user = {
        userId: '',
        token: '',
        email: '',
        alias: ''
      }
    },
    posts(state, dataArray) {
      state.posts = dataArray
    },
    updateOnePost(state, returnedPost) {
      for (let post of state.posts) {
        if (post.id === returnedPost.id) {
          post = returnedPost
          return
        }
      }
    },
    deletePost(state, deletedPost) {
      for (let post of state.posts) {
        if (post.id === deletedPost.id) {
          let deletedPostIdx = state.posts.indexOf(post)
          state.posts.splice(deletedPostIdx, 1)
        }
      }
    },
    fillNewPost(state, newPost) {
      if (newPost.image == '') {
        state.newPost = {
          text: newPost.text,
          image: ''
        }
      } else {
        state.newPost = {
          text: newPost.text,
          image: newPost.image
        }
      }
    },
    changeLikes(state, likePostInfos) {
      let postToUpdate = state.posts.find(post => post.id == likePostInfos.id)
      let usersLiked = postToUpdate.usersLiked
      let usersDisliked = postToUpdate.usersDisliked
      let userId = state.user.userId
      switch (likePostInfos.like) {
        case 1:
          if (!usersLiked.includes(userId)) {
            usersLiked.push(userId)
            postToUpdate.likes = usersLiked.length
          }
          if (usersDisliked.includes(userId)) {
            const userIdx = usersDisliked.indexOf(userId)
            usersDisliked.splice(userIdx, 1)
            postToUpdate.dislikes = usersDisliked.length
          }
          break
        case -1:
          if (!usersDisliked.includes(userId)) {
            usersDisliked.push(userId)
            postToUpdate.dislikes = usersDisliked.length
          }
          if (usersLiked.includes(userId)) {
            const userIdx = usersLiked.indexOf(userId)
            usersLiked.splice(userIdx, 1)
            postToUpdate.likes = usersLiked.length
          }
          break
        case 0:
          if (usersLiked.includes(userId)) {
            const userIdx = usersLiked.indexOf(userId)
            usersLiked.splice(userIdx, 1)
            postToUpdate.likes = usersLiked.length
          }
          if (usersDisliked.includes(userId)) {
            const userIdx = usersDisliked.indexOf(userId)
            usersDisliked.splice(userIdx, 1)
            postToUpdate.dislikes = usersDisliked.length
          }
          break
      }
    }
  },
  actions: {
    createAccount: ({commit}, userLogInfos) => {
      return new Promise((resolve, reject) => {
        instance.post('/auth/signup', userLogInfos)
          .then((response) => {
            commit('setStatus', 'created')
            resolve(response)
          })
          .catch((error) => {
            commit('setStatus', 'error_user_path')
            reject(error)
          })
      })
    },
    login: ({commit}, userLogInfos) => {
      commit('setStatus', 'loading')
      return new Promise((resolve, reject) => {
        instance.post('/auth/login', userLogInfos)
          .then((response) => {
            commit('setStatus', 'logedIn')
            commit('log', response.data)
            commit('registerEmail', userLogInfos.email)
            resolve(response)
          })
          .catch((error) => {
            commit('setStatus', 'error_user_path')
            reject(error)
          })
      })
    },
    unlog: ({commit}) => {
      commit('setStatus', '')
      commit('unlog')
    },
    getPosts: ({commit}) => {
      return new Promise((resolve, reject) => {
        instance.get('/post')
          .then((response) => {
            commit('posts', response.data)
            resolve(response)
          })
          .catch((error) => reject(error))
      })
    },
    getOnePost: ({commit}, postInfos) => {
      return new Promise((resolve, reject) => {
        instance.get(`/post/${postInfos.id}`)
          .then((response) => {
            commit('updateOnePost', response.data.post)
            resolve(response)
          })
          .catch((error) => reject(error))
      })
    },
    createPost: ({commit}, postInfos) => {
      commit('fillNewPost', postInfos)
      if (postInfos.image == '') {
        return new Promise((resolve, reject) => {
          instance.post('/post', postInfos)
            .then((response) => resolve(response))
            .catch((error) => reject(error))
        })
      } else {
        let data = new FormData()
        data.append('post', `{"text": "${postInfos.text}"}`)
        data.append('image', postInfos.image, postInfos.image.name)
        return new Promise((resolve, reject) => {
          instance.post('/post', data)
            .then(commit('fillNewPost', {text: '', image: ''}))
            .then((response) => resolve(response))
            .catch((error) => reject(error))
        })
      }
    },
    updatePost: ({commit}, postUpdateInfos) => {
      commit
      return new Promise((resolve, reject) => {
        instance.put(`/post/${postUpdateInfos.id}`, postUpdateInfos)
          .then((response) => console.log(response))
        //.then(commit('updateOnePost', ))
          .then((response) => resolve(response))
          .catch((error) => reject(error))
      })
    },
    deletePost: ({commit}, postDeleteInfos) => {
      commit
      return new Promise((resolve, reject) => {
        instance.delete(`/post/${postDeleteInfos.id}`)
          .then(commit('deletePost', postDeleteInfos))
          .then((response) => resolve(response))
          .catch((error) => reject(error))
      })
    },
    likePost: ({commit}, likePayload) => {
      commit('changeLikes', likePayload)
      const likeRequest = {
        like: likePayload.like
      }
      return new Promise((resolve, reject) => {
        instance.post(`/post/${likePayload.id}/like`, likeRequest)
          .then((response) => resolve(response))
          .catch((error) => reject(error))
      })
    }
  },
  modules: {
  }
})
