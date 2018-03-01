<template>
  <div id="dashboard">
    <h1>That's the dashboard!</h1>
    <p>You should only get here if you're authenticated!</p>
    <pre>
      {{data}}
    </pre>
  </div>
</template>
<script>
  import axios from 'axios';

  export default {
    data() {
      return {
        data: '',
      };
    },
    created() {
      axios.get('https://vue-axios-9893b.firebaseio.com/users.json')
      .then(response => { this.data = response.data})
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