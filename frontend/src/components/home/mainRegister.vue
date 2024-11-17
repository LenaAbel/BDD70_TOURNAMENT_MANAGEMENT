<template>
  <div class="register mt-5 d-flex align-items-center justify-content-center">
    <b-card class="w-100" style="max-width: 500px;">
      <h2 class="text-center mb-4">Register</h2>
      <!-- Display error messages -->
      <div v-if="error" class="alert alert-danger mt-3" role="alert">
        {{ error }}
      </div>
      <b-alert v-if="$route.query.message" variant="success" dismissible class="mt-3">
        {{ $route.query.message }}
      </b-alert>

      <b-form @submit.prevent="register">
        <b-form-group label="Email" label-for="email">
          <b-form-input
              id="email"
              v-model="form.email"
              type="email"
              required
              placeholder="Enter your email"
          ></b-form-input>
        </b-form-group>
        <b-form-group label="First Name" label-for="name">
          <b-form-input
              id="name"
              v-model="form.name"
              required
              placeholder="Enter your first name"
          ></b-form-input>
        </b-form-group>
        <b-form-group label="Last Name" label-for="lastname">
          <b-form-input
              id="lastname"
              v-model="form.lastname"
              required
              placeholder="Enter your last name"
          ></b-form-input>
        </b-form-group>
        <b-form-group label="Nickname" label-for="nickname">
          <b-form-input
              id="nickname"
              v-model="form.nickname"
              required
              placeholder="Enter your nickname"
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
        <b-button type="submit" variant="primary" block>
          Register
        </b-button>
      </b-form>
      <p class="text-center mt-3">
        Already have an account?
        <b-link @click="$router.push('/login')">Login here</b-link>
      </p>
    </b-card>
  </div>
</template>

<script>
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
      error: null,
    };
  },
  methods: {
    async register() {
      this.error = null;
      try {
        // Dispatch the 'registerPlayer' action
        await this.$store.dispatch('registerPlayer', this.form);

        // Redirect the user to the desired page after successful registration
        this.$router.push('/home'); // Replace with your desired route
      } catch (err) {
        if (err.response && err.response.status === 409) {
          this.error = 'This email is already registered. Please log in instead.';
        } else if (err.response && err.response.data && err.response.data.error) {
          this.error = err.response.data.error;
        } else {
          this.error = 'An unexpected error occurred. Please try again.';
        }
      }
    },
  },
};
</script>
<style scoped>
.register {
  min-height: calc(100vh - 56px);
}

.b-card {
  padding: 2rem;
  background-color: #fff;
}

.register h2 {
  color: var(--pink);
}
</style>
