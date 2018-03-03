import Vue from 'vue'
import Vuex from 'vuex'

import router from './router';

import axios from './axios-auth'
import globalAxios from 'axios'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    apiKey: 'AIzaSyCMRAVfdHPu1jwr-3OZNfETB69jMK76n1M',
    idToken: null,
    userId: null,
    user: null,
  },
  mutations: {

    authUser(state, authUser)  {
      state.idToken = authUser.token;
      state.userId = authUser.userid;
      router.replace('./dashboard');
    },

    storeUser (state, user) {
      state.user = user
    },

    clearAuthData(state){
      state.idToken = null;
      state.userId = null;
    }
  },

  actions: {
    signup({state, commit, dispatch}, authData) {
      axios.post(`/signupNewUser?key=${state.apiKey}`, {
        ...authData,
        returnSecureToken: true,
      })
      .then(r => {
        console.log(r);
        commit('authUser', {
          token: r.data.idToken,
          userid: r.data.localId,
        })
        dispatch('storeUser', authData);
      })
      .catch(e => console.error(e.message));
    },

    signin({state ,commit}, authData) {
      axios.post(`/verifyPassword?key=${state.apiKey}`, {
        ...authData,
        returnSecureToken: true})
      .then(r => {
        console.log(r);
        commit('authUser', {
          token: r.data.idToken,
          userid: r.data.localId,
        })
      })
      .catch(e => console.error(e));
    },

    storeUser ({commit, state}, userData) {
      if (!state.idToken) {
        return
      }
      //Get user when we are authenticated
      globalAxios.post('/users.json' + '?auth=' + state.idToken, userData)
        .then(res => console.log(res))
        .catch(error => console.log(error))
    },

    fetchUser ({commit, state}) {
      if (!state.idToken) {
        return
      }
      globalAxios.get('/users.json' + '?auth=' + state.idToken)
        .then(res => {
          console.log(res)
          const data = res.data
          const users = []
          for (let key in data) {
            const user = data[key]
            user.id = key
            users.push(user)
          }
          console.log(users)
          commit('storeUser', users[0])
        })
        .catch(error => console.log(error))
    },

    logout({commit}){
      commit('clearAuthData');
      router.replace('/signin');
    }
  },

  getters: {
    user (state) {
      return state.user
    },

    isAuthenticated(state) {
      return state.idToken !== null;
    },
  }
})