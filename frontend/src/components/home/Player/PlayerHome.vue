<template>
  <div class="player-home mt-5">
    <b-container>
      <br><br><br>
      <h2 class="text-center mb-4">Welcome, {{ user.name }}!</h2>
      <p class="text-center">
        Explore tournaments, view your stats, and compete with other players.
      </p>

      <!-- Player Options -->
      <b-row class="text-center mt-5">
        <b-col md="4" class="mb-3">
          <b-card @click="goToTournaments" class="navigation-card">
            <b-icon icon="trophy-fill" font-scale="3" class="mb-3"></b-icon>
            <h5>View Tournaments</h5>
            <p>Join upcoming tournaments and compete!</p>
          </b-card>
        </b-col>
        <b-col md="4" class="mb-3">
          <b-card @click="goToProfile" class="navigation-card">
            <b-icon icon="person-circle" font-scale="3" class="mb-3"></b-icon>
            <h5>My Profile</h5>
            <p>View and update your profile.</p>
          </b-card>
        </b-col>
        <b-col md="4" class="mb-3">
          <b-card @click="goToStats" class="navigation-card">
            <b-icon icon="bar-chart-fill" font-scale="3" class="mb-3"></b-icon>
            <h5>My Stats</h5>
            <p>Check your game statistics and progress.</p>
          </b-card>
        </b-col>
      </b-row>
    </b-container>
  </div>
</template>

<script>
import { mapGetters } from 'vuex';

export default {
  name: 'PlayerHome',
  computed: {
    ...mapGetters(['currentUser']),
    user() {
      return this.currentUser || {};
    },
  },
  methods: {
    goToTournaments() {
      this.$router.push('/register-tournament');
    },
    goToProfile() {
      this.$router.push('/profile');
    },
    goToStats() {
      this.$router.push('/stats');
    },
  },
};
</script>

<style scoped>
.player-home {
  color: var(--navyblue);
}

.navigation-card {
  cursor: pointer;
  background-color: #f8f9fa;
  border-radius: 10px;
  transition: transform 0.2s ease, box-shadow 0.2s ease;
}

.navigation-card:hover {
  transform: translateY(-3px);
  box-shadow: 0px 6px 12px rgba(0, 0, 0, 0.15);
}
</style>
