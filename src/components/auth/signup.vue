<template>
  <div id="signup">
    <div class="signup-form">
      <form @submit.prevent="onSubmit">

        <div class="input" :class="{ invalid : $v.email.$error}">
          <label for="email">Mail</label>
          <input
                  type="email"
                  id="email"
                  @blur="$v.email.$touch()"
                  v-model="email">
          <div v-if="!$v.email.email" class="invalid cursive">
            Please type your email
          </div>
          <div v-if="!$v.email.required" class="invalid cursive">
            This field must not be empty
          </div>
          <div>
          </div>
        </div>

        <div class="input" :class="{ invalid: $v.age.$error} ">
          <label for="age">Your Age</label>
          <input
                  type="number"
                  id="age"
                  @blur="$v.age.$touch()"
                  v-model.number="age">
            <p v-if="!$v.age.minVal">
              You have to {{ $v.age.$params.minVal.min}} be at least
            </p>
        </div>

        <div class="input" :class="{ invalid: $v.password.$error}" >
          <label for="password">Password</label>
          <input
                  type="password"
                  id="password"
                  @blur="$v.password.$touch()"
                  v-model="password">
        </div>

        <div class="input" :class="{ invalid: $v.confirmPassword.$error}" >
          <label for="confirm-password">Confirm Password</label>
          <input
                  type="password"
                  id="confirm-password"
                  @blur="$v.confirmPassword.$touch()"
                  v-model="confirmPassword">
        </div>

        <div class="input">
          <label for="country">Country</label>
          <select id="country" v-model="country">
            <option value="usa">USA</option>
            <option value="india">India</option>
            <option value="uk">UK</option>
            <option value="germany">Germany</option>
          </select>
        </div>

        <div class="hobbies">
          <h3>Add some Hobbies</h3>
          <button @click="onAddHobby" type="button">Add Hobby</button>
          <div class="hobby-list">
            <div :class="{ invalid: $v.hobbyInputs.$each[index].$error}"
                    class="input"
                    v-for="(hobbyInput, index) in hobbyInputs"
                    :key="hobbyInput.id">
              <label :for="hobbyInput.id">Hobby #{{ index }}</label>
              <input
                      type="text"
                      :id="hobbyInput.id"
                      @blur="$v.hobbyInputs.$each[index].value.$touch()"
                      v-model="hobbyInput.value">
              <button @click="onDeleteHobby(hobbyInput.id)" type="button">X</button>
            </div>
            <p v-if="!$v.hobbyInputs.minLen" class="cursive">
              You have to specify at least {{ $v.hobbyInputs.$params.minLen.min}} hobbies
            </p>

            <p v-if="!$v.hobbyInputs.required" class="cursive">
              Please add your hobbies =)
            </p>
          </div>
        </div>

        <div class="input inline" :class="{ invalid: $v.terms.required} " >
          <input type="checkbox"
                 @change="$v.terms.$touch()"
                 id="terms" v-model="terms">
          <label for="terms">Accept Terms of Use</label>
        </div>

        <div class="submit">
          <button :disabled='$v.$invalid' type="submit">Submit</button>
        </div>
      </form>
    </div>
  </div>
</template>

<script>
  import axios from '../../axios-auth';
  import globalAxios from 'axios';

  import {  required, 
            email,
            numeric, 
            minLength, 
            minValue, 
            maxLength, 
            sameAs,
            requiredUnless } from 'vuelidate/lib/validators'

  export default {
    data () {
      return {
        email: '',
        age: 19,
        password: '123456',
        confirmPassword: '123456',
        country: 'germany',
        hobbyInputs: [
          {
            id: 448.5931693158909,
            value: 'Playing Guitar',
          },
          {
            id:61.30020011701523,
            value:"Poems",
          },
          {
            id:95.34240825918103,
            value:"Soccer",
          }],
        terms: false,
      }
    },

    validations: {
      email: {
        required,
        email,
        unique: val => {
          if ( val === '') return true

          return globalAxios.get(`/users.json?orderBy="email"&equalTo="${val}"`)
          // return axios.get('/users.json?orderBy="email"&equalTo="' + val + '"')
                 .then( r => {
                    return Object.keys(r.data).length === 0
                 })

        },
      },
      age: {
        required,
        numeric,
        minVal: minValue(18),
        maxLength: maxLength(6),
      },
      password: {
        required,
        minLen: minLength(6),
      },
      confirmPassword: {
        sameAs: sameAs('password'),
        // sameAs: sameAs(vm => {
        //   return vm.password + 'b'
        // }),
      },
      terms: {
        required: requiredUnless( vm => {
          return vm.country === 'germany'
        }),
      },
      hobbyInputs: {
        required,
        minLen: minLength(3),
        $each: {
          value:{
            required,
            minLen: minLength(5),
          },

        },

      },
    },

    methods: {
      onAddHobby () {
        const newHobby = {
          id: Math.random() * Math.random() * 1000,
          value: ''
        }
        this.hobbyInputs.push(newHobby)
      },
      onDeleteHobby (id) {
        this.hobbyInputs = this.hobbyInputs.filter(hobby => hobby.id !== id)
      },
      onSubmit () {
        const formData = {
          email: this.email,
          age: this.age,
          password: this.password,
          confirmPassword: this.confirmPassword,
          country: this.country,
          hobbies: this.hobbyInputs.map(hobby => hobby.value),
          terms: this.terms,
        }
        this.$store.dispatch('signup', {
          email: formData.email,
          password: formData.password});
      }
    }
  }
</script>

<style scoped>
  .cursive {
    font-style: italic;
  }

  .signup-form {
    width: 400px;
    margin: 30px auto;
    border: 1px solid #eee;
    padding: 20px;
    box-shadow: 0 2px 3px #ccc;
  }

  .input {
    margin: 10px auto;
  }

  .input label {
    display: block;
    color: #4e4e4e;
    margin-bottom: 6px;
  }

  .input.inline label {
    display: inline;
  }

  .input input {
    font: inherit;
    width: 100%;
    padding: 6px 12px;
    box-sizing: border-box;
    border: 1px solid #ccc;
  }

  .input.inline input {
    width: auto;
  }

  .input input:focus {
    outline: none;
    border: 1px solid #521751;
    background-color: #eee;
  }

  .input select {
    border: 1px solid #ccc;
    font: inherit;
  }

  .hobbies button {
    border: 1px solid #521751;
    background: #521751;
    color: white;
    padding: 6px;
    font: inherit;
    cursor: pointer;
  }

  .hobbies button:hover,
  .hobbies button:active {
    background-color: #8d4288;
  }

  .hobbies input {
    width: 90%;
  }

  .submit button {
    border: 1px solid #521751;
    color: #521751;
    padding: 10px 20px;
    font: inherit;
    cursor: pointer;
  }

  .submit button:hover,
  .submit button:active {
    background-color: #521751;
    color: white;
  }

  .submit button[disabled],
  .submit button[disabled]:hover,
  .submit button[disabled]:active {
    border: 1px solid #ccc;
    background-color: transparent;
    color: #ccc;
    cursor: not-allowed;
  }
  
  .input input {
    border-radius: 2px
  }


  .input.invalid label {
    color: rgb(255, 146, 146);
  }

  .input.invalid input {
    background-color: rgb(255, 186, 186);
    border-color: rgb(255, 94, 94);
  }
</style>