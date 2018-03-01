<template>
  <div id="dashboard">
    <h1>That's the dashboard!</h1>
    <p>You should only get here if you're authenticated!</p>
    <p>Your email {{email}}</p>
  </div>
</template>
<script>
  import axios from 'axios';

  export default {
    data() {
      return {
        email: '',
      };
    },
    created() {
      axios.get('/users.json')
      .then(response => {
          const data = response.data;
          const users = [];
          for( let key in data) {
            const user = data[key];
            user.id = key;
            users.push(user);
          }
          console.log(users);
          this.email = users[0].email;
        })
      .catch(e => console.error(e));
    }
  }
</script>
<style scoped>
  h1, p {
    text-align: center;
  }

  p {
    color: red;
  }
</style>