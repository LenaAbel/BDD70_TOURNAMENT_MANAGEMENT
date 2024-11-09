<!-- src/components/mainRegister.vue -->
<template>
  <div class="register mt-5 d-flex align-items-center justify-content-center">
    <b-card class="w-100" style="max-width: 500px;">
      <h2 class="text-center mb-4">Register</h2>
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
          Register
        </b-button>
      </b-form>
      <p class="text-center mt-3">
        Already have an account?
        <b-link
            @click="$router.push('/login')"
            class="magical-brush-link"
        >Login here</b-link>
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
        password: '',
      },
    };
  },
  methods: {
    register() {
      // Placeholder for registration logic
      this.$router.push('/login');
    },
  },
};
</script>

<style scoped>
.register {
  min-height: calc(100vh - 56px); /* Adjust for navbar height if fixed-top */
}

.b-card {
  padding: 2rem;
  background-color: #fff;
}

.register h2 {
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
