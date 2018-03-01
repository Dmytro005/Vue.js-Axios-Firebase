import axios from 'axios';

const instance = axios.create({
  baseURL: 'https://vue-axios-9893b.firebaseio.com',

});

instance.defaults.headers.common['DOG'] = 'Chack';

export default instance