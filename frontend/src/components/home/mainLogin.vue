<template>
  <div class="login mt-5 d-flex align-items-center justify-content-center">
    <b-card class="w-100" style="max-width: 500px;">
      <h2 class="text-center mb-4">Login</h2>

      <!-- Display error or success messages -->
      <b-alert v-if="error" variant="danger" dismissible class="mt-3">
        {{ error }}
      </b-alert>
      <b-alert v-if="successMessage" variant="success" dismissible class="mt-3">
        {{ successMessage }}
      </b-alert>

      <!-- Login form -->
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
        <b-button type="submit" variant="primary" block>
          Login
        </b-button>
      </b-form>
    </b-card>
  </div>
</template>

<script>
import { mapActions } from "vuex";

export default {
  name: "mainLogin",
  data() {
    return {
      form: {
        email: "",
        password: "",
      },
      error: null,
      successMessage: null,
    };
  },
  created() {
    // Check for a success message in the query parameters
    if (this.$route.query.message) {
      this.successMessage = this.$route.query.message;

      // Clear the query parameters after extracting the message
      this.$router.replace({ query: null });
    }
  },
  methods: {
    ...mapActions(["loginUser"]),
    login() {
      this.error = null;

      this.loginUser(this.form)
          .then((user) => {
            if (!user || !user.account_type) {
              throw new Error("Login response is missing account_type");
            }

            // Redirect based on account type
            if (user.account_type === "admin") {
              this.$router.push("/admin/dashboard");
            } else if (user.account_type === "player") {
              this.$router.push("/");
            } else {
              this.error = "Unknown account type.";
            }
          })
          .catch((error) => {
            // Capture the error message from the backend or use a default message
            this.error =
                error.response?.data?.error || "Invalid email or password.";
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
