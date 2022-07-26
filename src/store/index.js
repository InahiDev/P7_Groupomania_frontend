import { createStore } from 'vuex'

const axios = require('axios')
const instance = axios.create({
  baseURL: 'http://localhost:3000/api'
})

let unlogUser = {
  userId: '',
  token: ''
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
    user: user,
    posts: []
  },
  getters: {
  },
  mutations: {
    setStatus(state, status) {
      state.status = status
    },
    log(state, user) {
      state.user = user
      localStorage.setItem('user', JSON.stringify(user))
    },
    unlog(state) {
      state.user = unlogUser
      localStorage.removeItem('user')
    },
    posts(state, dataArray) {
      state.posts = dataArray
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
      commit
      return new Promise((resolve, reject) => {
        instance.post('/post', postInfos)
          .then((response) => {
            //getPosts()
            resolve(response)
          })
          .catch((error) => reject(error))
      })
    },
    updatePost: ({commit}, postUpdateInfos) => {
      commit
      return new Promise((resolve, reject) => {
        instance.put('/post/:id', postUpdateInfos)
          .then((response) => {
            //getPosts()
            resolve(response)
          })
          .catch((error) => reject(error))
      })
    },
    deletePost: ({commit}) => {
      commit
      return new Promise((resolve, reject) => {
        instance.delete('/post/:id')
          .then((response) => {
            //getPosts()
            resolve(response)
          })
          .catch((error) => reject(error))
      })
    },
    likePost: ({commit}, likePayload) => {
      commit
      return new Promise((resolve, reject) => {
        instance.post('/post/:id/like', likePayload)
          .then((response) => {
            //getPosts()
            resolve(response)
          })
          .catch((error) => reject(error))
      })
    }
  },
  modules: {
  }
})
