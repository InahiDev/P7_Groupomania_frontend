import { createStore } from 'vuex'



const axios = require('axios')
const instance = axios.create({
  baseURL: 'http://localhost:3000/api'
})

let user = localStorage.getItem('user')
if (!user) {
  user =  {
    userId: '',
    token: ''
  }
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
      avatar: '',
    },
    posts: undefined,
  },
  getters: {
  },
  mutations: {
    SET_STATUS(state, status) {
      state.status = status
    },
    REGISTER_EMAIL(state, email) {
      state.user.email = email
    },
    LOG(state, user) {
      state.user = user
      instance.defaults.headers.common['Authorization'] = `Bearer ${user.token}`
      localStorage.setItem('user', JSON.stringify({user: user.userId, token: user.token}))
    },
    UNLOG(state) {
      localStorage.removeItem('user')
      state.user = {
        userId: '',
        token: '',
        email: '',
        alias: ''
      }
    },
    GET_POSTS(state, dataArray) {
      state.posts = dataArray
    },
    UPDATE_POST(state, updatedPost) {
      console.log("étape n°4 UPDATE_POST")
      for (let post of state.posts) {
        if (post.id == updatedPost.id) {
          let postIdx = state.posts.indexOf(post)
          state.posts[postIdx] = updatedPost
          return
        }
      }
    },
    CREATE_POST(state, createdPost) {
      console.log('étape n°3 CREATE_POST')
      state.posts.unshift(createdPost)
    },
    DELETE_POST(state, deletedPost) {
      for (let post of state.posts) {
        if (post.id === deletedPost.id) {
          let deletedPostIdx = state.posts.indexOf(post)
          state.posts.splice(deletedPostIdx, 1)
        }
      }
    }
  },
  actions: {
    createAccount: ({commit}, userLogInfos) => {
      return new Promise((resolve, reject) => {
        instance.post('/auth/signup', userLogInfos)
          .then(response => {
            commit('SET_STATUS', 'created')
            resolve(response)
          })
          .catch(error => {
            commit('SET_STATUS', 'error_user_path--signin')
            reject(error)
          })
      })
    },
    login: ({commit}, userLogInfos) => {
      commit('SET_STATUS', 'loading')
      return new Promise((resolve, reject) => {
        instance.post('/auth/login', userLogInfos)
          .then(response => {
            commit('SET_STATUS', 'logedIn')
            commit('LOG', response.data)
            commit('REGISTER_EMAIL', userLogInfos.email)
            resolve(response)
          })
          .catch(error => {
            commit('SET_STATUS', 'error_user_path--login')
            reject(error)
          })
      })
    },
    unlog: ({commit}) => {
      commit('SET_STATUS', '')
      commit('UNLOG')
    },
    getPosts: ({commit}) => {
      return new Promise((resolve, reject) => {
        instance.get('/post')
          .then((response) => {
            commit('GET_POSTS', response.data)
            resolve(response)
          })
          .catch(error => reject(error))
      })
    },
    //async getOnePost({commit}, post) {
    //    let updatedPost = await instance.get(`/post/${post.id}`)
    //    commit('UPDATE_POST', updatedPost.data.post)
    //},

    //      let updatedPost = await instance.get(`/post/${post.id}`)
    //      console.log(updatedPost)
    //
    //
    //
    getOnePost: ({commit}, post) => {
      return new Promise((resolve, reject) => {
        instance.get(`/post/${post.id}`)
          .then((response) => {
            console.log("étape n°3 => getOnePost")
            commit('UPDATE_POST', response.data.post)
            resolve(response)
          })
          .catch((error) => reject(error))
      })
    },
    //async createPost({commit}, postInfos) {
    //  if (postInfos.image == '') {
    //    try {
    //      let createdPost = await instance.post('/post', postInfos)
    //      commit('CREATE_POST', createdPost.data.data)
    //    } catch(error) {
    //      console.log(error)
    //    }
    //
    //
    //  }
    //},
    
    createPost: ({commit}, postInfos) => {
      if (postInfos.image == '') {
        return new Promise((resolve, reject) => {
          instance.post('/post', postInfos)
            .then((response) => {
              console.log('étape n°2 createPost')
              commit('CREATE_POST', response.data.data)
              resolve(response)
            })
            .catch(error => reject(error))
        })
      } else {
        let data = new FormData()
        data.append('post', `{"text": "${postInfos.text}"}`)
        data.append('image', postInfos.image, postInfos.image.name)
        return new Promise((resolve, reject) => {
          instance.post('/post', data)
            .then((response) => {
              console.log('étape n°2 createPost')
              commit('CREATE_POST', response.data.data)
              resolve(response)
            })
            .catch(error => reject(error))
        })
      }
    },
    updatePostWithImage: ({dispatch}, postUpdateInfos) => {
      if (!postUpdateInfos.image) {
        let updateTextOnImgReq = {
          text: postUpdateInfos.text
        }
        return new Promise((resolve, reject) => {
          instance.put(`/post/${postUpdateInfos.id}`, updateTextOnImgReq)
            .then(response => {
              console.log("étape 2 => updatePostWithImage")
              dispatch('getOnePost', postUpdateInfos)
              resolve(response)
            })
            .catch(error => reject(error))
        })
      } else if (postUpdateInfos.image == 'killImage') {
        const updateImgDeletionReq = {
          text: postUpdateInfos.text,
          image: ""
        }
        return new Promise((resolve, reject) => {
          instance.put(`/post/${postUpdateInfos.id}`, updateImgDeletionReq)
            .then(response => {
              console.log("étape 2 => updatePostWithImage")
              dispatch('getOnePost', postUpdateInfos)
              resolve(response)
            })
            .catch(error => reject(error))
        })
      } else if (postUpdateInfos.image !== '') {
        let data = new FormData()
        data.append('post', `{"text": "${postUpdateInfos.text}"}`)
        data.append('image', postUpdateInfos.image, postUpdateInfos.image.name)
        return new Promise((resolve, reject) => {
          console.log("étape 2 => updatePostWithImage")
          instance.put(`/post/${postUpdateInfos.id}`, data)
            .then(response => {
              dispatch('getOnePost', postUpdateInfos)
              resolve(response)
            })
            .catch(error => reject(error))
        })
      }
    },
    updatePostWithoutImage({dispatch}, postUpdateInfos) {
      if (!postUpdateInfos.image) {
        return new Promise((resolve, reject) => {
          console.log("étape 2 => updatePostWithoutImage")
          instance.put(`/post/${postUpdateInfos.id}`, {
            text: postUpdateInfos.text,
            image: ""
          })
            .then(response => {
              dispatch('getOnePost', postUpdateInfos)
              resolve(response)
            })
            .catch((error) => reject(error))
        })
      } else if (postUpdateInfos.image) {
        let data = new FormData()
        data.append('post', `{"text": "${postUpdateInfos.text}"}`)
        data.append('image', postUpdateInfos.image, postUpdateInfos.image.name)
        return new Promise((resolve, reject) => {
          console.log("étape 2 => updatePostWithoutImage")
          instance.put(`/post/${postUpdateInfos.id}`, data)
            .then(response => {
              dispatch('getOnePost', postUpdateInfos)
              resolve(response)
            })
            .catch((error) => reject(error))
        })
      }
    },
    deletePost: ({commit}, postDeleteInfos) => {
      return new Promise((resolve, reject) => {
        instance.delete(`/post/${postDeleteInfos.id}`)
          .then(response => {
            commit('DELETE_POST', postDeleteInfos)
            resolve(response)
          })
          .catch((error) => reject(error))
      })
    },
    likePost: ({dispatch}, likePayload) => {
      const likeRequest = {
        like: likePayload.like
      }
      return new Promise((resolve, reject) => {
        instance.post(`/post/${likePayload.id}/like`, likeRequest)
          .then((response) => {
            dispatch('getOnePost', likePayload)
            resolve(response)
          })
          .catch(error => reject(error))
      })
    }
  },
  modules: {
  }
})
