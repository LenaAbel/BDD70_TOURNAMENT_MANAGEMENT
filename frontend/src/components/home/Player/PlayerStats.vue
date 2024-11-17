<template>
  <div className="player-stats">
    <b-container className="mt-5 pt-5">
      <h2 className="text-center mb-4">My Statistics</h2>

      <!-- Loading Indicator -->
      <div v-if="loading" className="text-center my-4">
        <b-spinner label="Loading..."></b-spinner>
      </div>

      <!-- Error Message -->
      <b-alert v-if="error" variant="danger" dismissible className="my-4">
        {{ error }}
      </b-alert>

      <!-- Stats Chart -->
      <div v-if="!loading && !error">
        <canvas id="stats-chart" width="400" height="200"></canvas>
      </div>
    </b-container>
  </div>
</template>

<script>
import Chart from "chart.js/auto";

export default {
  data() {
    return {
      stats: null, // Player statistics data
      loading: true,
      error: null,
      chart: null,
    };
  },
  methods: {
    fetchPlayerStats() {
      const playerId = this.$store.getters.currentUser.player_id;

      this.$store
          .dispatch("fetchPlayerStats", playerId)
          .then((data) => {
            this.stats = data;
            this.createChart(); // Initialize the chart after data is fetched
          })
          .catch((err) => {
            this.error = "Failed to load statistics. Please try again.";
            console.error(err);
          })
          .finally(() => {
            this.loading = false;
          });
    },
    createChart() {
      this.$nextTick(() => {
        const canvas = document.getElementById("stats-chart");
        if (!canvas) {
          console.error("Canvas element not found!");
          return;
        }

        const ctx = canvas.getContext("2d");

        const labels = this.stats.map((stat) => stat.activity_name); // Example: activity names
        const wins = this.stats.map((stat) => stat.player_stats_wins);
        const losses = this.stats.map((stat) => stat.player_stats_losses);
        const draws = this.stats.map((stat) => stat.player_stats_draws);

        if (this.chart) {
          this.chart.destroy(); // Destroy the previous chart if it exists
        }

        this.chart = new Chart(ctx, {
          type: "bar",
          data: {
            labels: labels,
            datasets: [
              {
                label: "Wins",
                data: wins,
                backgroundColor: "rgba(75, 192, 192, 0.2)",
                borderColor: "rgba(75, 192, 192, 1)",
                borderWidth: 1,
              },
              {
                label: "Losses",
                data: losses,
                backgroundColor: "rgba(255, 99, 132, 0.2)",
                borderColor: "rgba(255, 99, 132, 1)",
                borderWidth: 1,
              },
              {
                label: "Draws",
                data: draws,
                backgroundColor: "rgba(255, 206, 86, 0.2)",
                borderColor: "rgba(255, 206, 86, 1)",
                borderWidth: 1,
              },
            ],
          },
          options: {
            responsive: true,
            plugins: {
              legend: {
                position: "top",
              },
            },
            scales: {
              y: {
                beginAtZero: true,
              },
            },
          },
        });
      });
    },
  },
  mounted() {
    this.fetchPlayerStats();
  },
};
</script>

<style scoped>
.player-stats {
  color: var(--navyblue);
  margin-top: 30px;
}
</style>
