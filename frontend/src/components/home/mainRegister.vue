<!-- src/components/mainRegister.vue -->
<template>
  <div class="register mt-5">
    <b-container>
      <h2 class="text-center mb-4">Register</h2>
      <b-form @submit.prevent="register">
        <b-form-group label="Email" label-for="email">
          <b-form-input id="email" v-model="form.email" type="email" required></b-form-input>
        </b-form-group>
        <b-form-group label="First Name" label-for="name">
          <b-form-input id="name" v-model="form.name" required></b-form-input>
        </b-form-group>
        <b-form-group label="Last Name" label-for="lastname">
          <b-form-input id="lastname" v-model="form.lastname" required></b-form-input>
        </b-form-group>
        <b-form-group label="Nickname" label-for="nickname">
          <b-form-input id="nickname" v-model="form.nickname"></b-form-input>
        </b-form-group>
        <b-form-group label="Password" label-for="password">
          <b-form-input id="password" v-model="form.password" type="password" required></b-form-input>
        </b-form-group>
        <b-button type="submit" variant="primary" block>Register</b-button>
      </b-form>
    </b-container>
  </div>
</template>

<script>
import axios from 'axios';

export default {
  name: 'mainRegister',
  data() {
    return {
      form: {
        email: '',
        name: '',
        lastname: '',
        nickname: '',
        password: '',
      },
    };
  },
  methods: {
    register() {
      axios
          .post('/api/players', this.form)
          .then(() => {
            this.$router.push('/login');
          })
          .catch((error) => {
            console.error('Registration error:', error);
            // Handle error (e.g., show a notification)
          });
    },
  },
};
</script>

<style scoped>
.register {
  color: #fff;
}

.register h2 {
  color: var(--pink);
}

.b-container {
  max-width: 500px;
}

label {
  font-family: 'MagicNeys', sans-serif;
  font-weight: normal;
  color: var(--darkblue);
}
</style>
