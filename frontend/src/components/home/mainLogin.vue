<!-- src/components/mainLogin.vue -->
<template>
  <div class="login mt-5 d-flex align-items-center justify-content-center">
    <b-card class="w-100" style="max-width: 500px;">
      <h2 class="text-center mb-4">Login</h2>
      <b-alert v-if="error" variant="danger" dismissible class="mt-3">
        {{ error }}
      </b-alert>
      <b-form @submit.prevent="login">
        <b-form-group label="Email" label-for="email">
          <b-form-input
              id="email"
              v-model="form.email"
              type="email"
              required
              placeholder="Enter your email"
          ></b-form-input>
        </b-form-group>
        <b-form-group label="Password" label-for="password">
          <b-form-input
              id="password"
              v-model="form.password"
              type="password"
              required
              placeholder="Enter your password"
          ></b-form-input>
        </b-form-group>
        <b-button
            type="submit"
            variant="primary"
            block
            class="magical-brush-button"
        >
          Login
        </b-button>
      </b-form>
      <p class="text-center mt-3">
        Don't have an account?
        <b-link @click="$router.push('/register')" class="magical-brush-link"
        >Register here</b-link
        >
      </p>
    </b-card>
  </div>
</template>

<script>
import { mapActions } from 'vuex';

export default {
  name: 'mainLogin',
  data() {
    return {
      form: {
        email: '',
        password: '',
      },
      error: null,
    };
  },
  methods: {
    ...mapActions(['loginUser']),
    login() {
      this.error = null;
      this.loginUser(this.form)
          .then(() => {
            // Redirect all users to main home after login
            this.$router.push('/');
          })
          .catch((error) => {
            console.error('Login error:', error);
            this.error = error.response?.data?.error || 'Login failed.';
          });
    },

  },
};
</script>

<style scoped>
.login {
  min-height: calc(100vh - 56px); /* Adjust for navbar height if fixed-top */
}

.b-card {
  padding: 2rem;
  background-color: #fff;
}

.login h2 {
  color: var(--pink);
}

label {
  font-family: 'MagicNeys', sans-serif;
  font-weight: normal;
  color: var(--darkblue);
}

.magical-brush-button {
  font-family: 'MagicalBrush', cursive;
}

.magical-brush-link {
  font-family: 'MagicalBrush', cursive;
  cursor: pointer;
  color: var(--pink);
}

.magical-brush-link:hover {
  text-decoration: underline;
}
</style>
