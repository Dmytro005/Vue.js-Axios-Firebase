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

    setLogoutTimer({commit, dispatch}, expirationTime){
      setTimeout(() => {
        dispatch('logout');
      }, expirationTime * 1000);
    },

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
        const now = new Date();
        const expirationDate = new Date( now.getTime() + r.data.expiresIn * 1000 );
        localStorage.setItem('expirationDate', expirationDate); 
        localStorage.setItem('userId', r.data.localId); 
        localStorage.setItem('token', r.data.idToken);
        dispatch('storeUser', authData);
        dispatch('setLogoutTimer', r.data.expiresIn);
      })
      .catch(e => console.error(e.message));
    },

    signin({state ,commit, dispatch}, authData) {
      axios.post(`/verifyPassword?key=${state.apiKey}`, {
        ...authData,
        returnSecureToken: true})
      .then(r => {
        console.log(r);
        commit('authUser', {
          token: r.data.idToken,
          userid: r.data.localId,
        })
        const now = new Date();
        const expirationDate = new Date( now.getTime() + r.data.expiresIn * 1000 );
        localStorage.setItem('expirationDate', expirationDate); 
        localStorage.setItem('userId', r.data.localId); 
        localStorage.setItem('token', r.data.idToken);
        dispatch('setLogoutTimer', r.data.expiresIn);
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

    tryAutoSignIn ({commit}) {
      const token = localStorage.getItem('token');
      
      if(!token){
        return
      } 
      const expirationDate = localStorage.getItem('expirationDate');
      const now = new Date();
      if ( now >= expirationDate ) {
        return;
      }
      const userId = localStorage.getItem('userId');
      console.log(token, userId);
      
      commit('authUser', { token, userId });
    },

    logout({commit}){
      commit('clearAuthData');
      localStorage.removeItem('expirationDate')
      localStorage.removeItem('userId')
      localStorage.removeItem('token')
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
});