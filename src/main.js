import Vue from 'vue'
import App from './App.vue'

import axios from 'axios'

axios.defaults.baseURL ='https://vue-axios-9893b.firebaseio.com/';

import router from './router'
import store from './store'

new Vue({
  el: '#app',
  router,
  store,
  render: h => h(App)
})
