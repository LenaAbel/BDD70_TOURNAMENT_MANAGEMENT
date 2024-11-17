<template>
  <div class="home">
    <!-- Hero Section -->
    <section class="hero d-flex align-items-center">
      <div class="container text-center">
        <br>
        <h1 class="display-4 big-title">Welcome to</h1>
        <br>
        <h1>Game Tournaments</h1>
        <br><br>

        <!-- Conditional Content Based on User Role -->
        <div v-if="userRole === 'admin'">
          <p class="lead">Manage tournaments and oversee the gaming community!</p>
          <br>
          <b-button
              style="background-color: #001994"
              size="lg"
              class="mr-2"
              @click="$router.push('/admin/dashboard')"
          >
            Go to Dashboard
          </b-button>
        </div>
        <div v-else-if="userRole === 'player'">
          <p class="lead">Welcome, {{ userName }}! Explore tournaments, track your stats, and compete!</p>
          <br>
          <b-button
              style="background-color: #001994"
              size="lg"
              class="mr-2"
              @click="$router.push('/tournaments')"
          >
            Explore Tournaments
          </b-button>
          <b-button
              style="background-color: #001994"
              size="lg"
              @click="$router.push('/profile')"
          >
            View Profile
          </b-button>
        </div>
        <div v-else>
          <p class="lead">Join and compete in exciting board game tournaments!</p>
          <br>
          <b-button
              style="background-color: #001994"
              size="lg"
              class="mr-2"
              @click="$router.push('/register')"
          >
            Get Started
          </b-button>
        </div>
      </div>
    </section>

    <!-- Features Section -->
    <section class="features py-5">
      <b-container>
        <!-- Conditional Title -->
        <h2 class="text-center mb-5" v-if="userRole === 'admin'">Admin Features</h2>
        <h2 class="text-center mb-5" v-else-if="userRole === 'player'">Player Features</h2>
        <h2 class="text-center mb-5" v-else>Features</h2>
        <br>
        <b-row>
          <!-- Admin Features -->
          <template v-if="userRole === 'admin'">
            <b-col md="4" class="text-center mb-4">
              <b-icon icon="trophy-fill" class="icon-custom-color" font-scale="4"></b-icon>
              <h4 class="mt-3">Manage Tournaments</h4>
              <p>Create and edit tournaments.</p>
            </b-col>
            <b-col md="4" class="text-center mb-4">
              <b-icon icon="people-fill" font-scale="4" class="icon-custom-color"></b-icon>
              <h4 class="mt-3">Oversee Players</h4>
              <p>Manage player registrations and profiles.</p>
            </b-col>
            <b-col md="4" class="text-center mb-4">
              <b-icon icon="graph-up" class="icon-custom-color" font-scale="4"></b-icon>
              <h4 class="mt-3">View Statistics</h4>
              <p>Analyze tournament outcomes and player rankings.</p>
            </b-col>
          </template>

          <!-- Player Features -->
          <template v-else-if="userRole === 'player'">
            <b-col md="4" class="text-center mb-4">
              <b-icon icon="trophy-fill" class="icon-custom-color" font-scale="4"></b-icon>
              <h4 class="mt-3">Compete in Tournaments</h4>
              <p>Participate in ongoing tournaments and track your progress.</p>
            </b-col>
            <b-col md="4" class="text-center mb-4">
              <b-icon icon="graph-up" class="icon-custom-color" font-scale="4"></b-icon>
              <h4 class="mt-3">Track Your Stats</h4>
              <p>View your game stats, rankings, and performance history.</p>
            </b-col>
            <b-col md="4" class="text-center mb-4">
              <b-icon icon="gear-fill" font-scale="4" class="icon-custom-color"></b-icon>
              <h4 class="mt-3">Manage Your Profile</h4>
              <p>Update your profile and preferred games.</p>
            </b-col>
          </template>

          <!-- Default Features -->
          <template v-else>
            <b-col md="4" class="text-center mb-4">
              <b-icon icon="people-fill" font-scale="4" class="icon-custom-color"></b-icon>
              <h4 class="mt-3">Player Registration</h4>
              <p>Create your profile and join tournaments.</p>
            </b-col>
            <b-col md="4" class="text-center mb-4">
              <b-icon icon="trophy-fill" class="icon-custom-color" font-scale="4"></b-icon>
              <h4 class="mt-3">Compete and Win</h4>
              <p>Participate in tournaments and climb the rankings.</p>
            </b-col>
            <b-col md="4" class="text-center mb-4">
              <b-icon icon="graph-up" class="icon-custom-color" font-scale="4"></b-icon>
              <h4 class="mt-3">Track Your Progress</h4>
              <p>View your stats and improve your gameplay.</p>
            </b-col>
          </template>
        </b-row>
      </b-container>
    </section>
  </div>
</template>

<script>
import { mapGetters } from "vuex";

export default {
  name: "mainHome",
  computed: {
    ...mapGetters(["userRole", "currentUser"]),
    userName() {
      return this.currentUser ? this.currentUser.name : "Player";
    },
  },
};
</script>

<style scoped>
.home {
  color: #fff;
}

.hero {
  background: linear-gradient(
      rgba(1, 4, 45, 0.7),
      rgba(1, 4, 45, 0.7)
  ),
  url("@/assets/background.jpeg") no-repeat center center;
  background-size: cover;
  min-height: 100vh;
}

.lead {
  font-size: 1.5rem;
  color: #ffffff;
}

.features {
  background-color: white;
}

.features h1 {
  color: white;
}

.features h2,
h4 {
  color: var(--pink);
}

.icon-custom-color {
  color: var(--navyblue);
}
</style>
