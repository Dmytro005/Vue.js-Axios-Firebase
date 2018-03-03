import Vue from 'vue'
import Vuex from 'vuex'

import axios from './axios-auth'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    apiKey: 'AIzaSyCMRAVfdHPu1jwr-3OZNfETB69jMK76n1M',
    idToken: '',
    userId: '',
  },
  mutations: {
    authUser(state, authUser)  {
      state.idToken = authUser.token;
      state.userId = authUser.userid;
    },
  },
  actions: {
    signup({state, commit}, authData) {
      axios.post(`/signupNewUser?key=${this.state.apiKey}`, {
        ...authData,
        returnSecureToken: true,
      })
      .then(r => {
        console.log(r);
        commit('authUser', {
          token: r.data.idToken,
          userid: r.data.localId,
        })
      })
      .catch(e => console.error(e));
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

    fetchUser() {
      
    }
  },
  getters: {

  }
})