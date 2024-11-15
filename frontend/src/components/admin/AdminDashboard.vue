<!-- src/components/admin/AdminDashboard.vue -->
<template>
  <div class="admin-dashboard">
    <b-container fluid class="mt-5">
      <!-- Header Section -->
      <br><br>
      <h2 class="text-center mb-4">Admin Dashboard</h2>
      <br>
      <p class="text-center">Welcome back, Admin! Manage and oversee the platform activities.</p>
      <br>
      <!-- Key Metrics Section -->
      <b-row class="mb-5 text-center">
        <b-col md="3" class="mb-3">
          <b-card class="metric-card" title="Total Players">
            <p class="metric-value">{{ totalPlayers }}</p>
          </b-card>
        </b-col>
        <b-col md="3" class="mb-3">
          <b-card class="metric-card" title="Total Tournaments">
            <p class="metric-value">{{ totalTournaments }}</p>
          </b-card>
        </b-col>
        <b-col md="3" class="mb-3">
          <b-card class="metric-card" title="Total Teams">
            <p class="metric-value">{{ totalTeams }}</p>
          </b-card>
        </b-col>
        <b-col md="3" class="mb-3">
          <b-card class="metric-card" title="Total Activities">
            <p class="metric-value">{{ totalActivities }}</p>
          </b-card>
        </b-col>
      </b-row>

      <!-- Quick Navigation Section -->
      <b-row class="mb-5">
        <b-col md="4" class="mb-3">
          <b-card class="navigation-card text-center" title="Manage Players" @click="goTo('AdminPlayers')">
            <p>View and manage all players.</p>
          </b-card>
        </b-col>
        <b-col md="4" class="mb-3">
          <b-card class="navigation-card text-center" title="Manage Tournaments" @click="goTo('AdminTournaments')">
            <p>Organize and manage tournaments.</p>
          </b-card>
        </b-col>
        <b-col md="4" class="mb-3">
          <b-card class="navigation-card text-center" title="Manage Teams" @click="goTo('AdminTeams')">
            <p>View and manage team details.</p>
          </b-card>
        </b-col>
      </b-row>
    </b-container>
  </div>
</template>

<script>
import { mapGetters } from "vuex";

export default {
  name: "AdminDashboard",
  computed: {
    ...mapGetters([
      "totalPlayers",
      "totalTournaments",
      "totalTeams",
      "totalActivities",
    ]),
  },
  methods: {
    goTo(routeName) {
      this.$router.push({ name: routeName });
    },
  },
  mounted() {
    this.$store.dispatch('fetchTournaments');
    this.$store.dispatch('fetchPlayers');
    this.$store.dispatch('fetchTeams');
    this.$store.dispatch('fetchActivities');
  }

};
</script>

<style scoped>
.admin-dashboard {
  color: var(--navyblue);
}

.metric-card {
  background-color: #f8f9fa;
  border-radius: 10px;
  box-shadow: 0px 4px 8px rgba(0, 0, 0, 0.1);
}

.metric-value {
  font-size: 2rem;
  font-weight: bold;
  margin: 0;
  font-family: "Montserrat", sans-serif;
}

.navigation-card {
  cursor: pointer;
  background-color: #f8f9fa;
  border-radius: 10px;
  transition: transform 0.2s ease, box-shadow 0.2s ease;
  text-align: center;
}

.navigation-card:hover {
  transform: translateY(-3px);
  box-shadow: 0px 6px 12px rgba(0, 0, 0, 0.15);
}

.overview-card {
  background-color: #ffffff;
}

.b-table th,
.b-table td {
  text-align: center;
}

.b-table td {
  vertical-align: middle;
}
</style>
