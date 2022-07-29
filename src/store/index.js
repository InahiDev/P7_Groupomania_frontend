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
        instance.put('/post/:id', postUpdateInfos)
          .then((response) => {
            resolve(response)
          })
          .catch((error) => reject(error))
      })
    },
    deletePost: ({commit}) => {
      commit
      return new Promise((resolve, reject) => {
        instance.delete('/post/:id')
          .then((response) => resolve(response))
          .catch((error) => reject(error))
      })
    },
    likePost: ({commit}, likePayload) => {
      commit
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
