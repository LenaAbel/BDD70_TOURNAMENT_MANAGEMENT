<!-- AdminStatistics.vue -->
<template>
  <div class="admin-statistics">
    <b-container class="mt-5">
      <br><br>
      <h2 class="text-center mb-4">Statistics</h2>
      <br>
      <!-- Loading Indicator -->
      <div v-if="isLoading" class="text-center my-4">
        <b-spinner label="Loading..."></b-spinner>
      </div>

      <!-- Error Message -->
      <b-alert v-if="error" dismissible variant="danger">
        {{ error }}
      </b-alert>

      <!-- General Statistics and Selection Layout -->
      <b-row class="justify-content-between mb-5">
        <!-- Statistics Cards on the Left -->
        <b-col md="4">
          <div class="statistics-cards">
            <b-row v-if="!isLoading && !error">
              <b-col v-for="stat in stats" :key="stat.label" md="12" class="mb-2">
                <b-card :title="stat.label" class="text-center stat-card">
                  <p class="stat-value">{{ stat.value }}</p>
                </b-card>
              </b-col>
            </b-row>
          </div>
        </b-col>

        <!-- Player and Team Selection on the Right -->
        <b-col md="8">
          <div class="selection-section">
            <!-- Player Selection -->
            <h4>Select Player to View Stats</h4>
            <b-form-select v-model="selectedPlayerId" :options="playerOptions" @change="loadPlayerStats" class="mb-3">
              <option :value="null">Select a player</option>
            </b-form-select>

            <!-- Display Player Stats and Chart -->
            <div v-if="playerStats">
              <b-card class="mb-4">
                <b-row>
                  <!-- Player Info on the Left -->
                  <b-col md="6" class="text-center">
                    <h5>{{ playerStats.player_name }} {{ playerStats.player_lastname }}</h5>
                    <p><strong>Matches:</strong> {{ playerStats.player_stats_total_matches }}</p>
                    <p><strong>Wins:</strong> {{ playerStats.player_stats_wins }}</p>
                    <p><strong>Losses:</strong> {{ playerStats.player_stats_losses }}</p>
                    <p><strong>Draws:</strong> {{ playerStats.player_stats_draws }}</p>
                  </b-col>

                  <!-- Chart or Message on the Right -->
                  <b-col md="6" class="d-flex justify-content-center align-items-center">
                    <div v-if="hasPlayerData">
                      <canvas ref="playerStatsChart" class="small-chart"></canvas>
                    </div>
                    <div v-else>
                      <p>No data is available</p>
                    </div>
                  </b-col>
                </b-row>
              </b-card>
            </div>

            <!-- Team Selection -->
            <h4>Select Team to View Stats</h4>
            <b-form-select v-model="selectedTeamId" :options="teamOptions" @change="loadTeamStats" class="mb-3">
              <option :value="null">Select a team</option>
            </b-form-select>

            <!-- Display Team Stats and Chart -->
            <div v-if="teamStats">
              <b-card class="mb-4">
                <b-row>
                  <!-- Team Info on the Left -->
                  <b-col md="6" class="text-center">
                    <h5>{{ teamStats.team_name }}</h5>
                    <p><strong>Matches:</strong> {{ teamStats.team_stats_total_matches }}</p>
                    <p><strong>Wins:</strong> {{ teamStats.team_stats_wins }}</p>
                    <p><strong>Losses:</strong> {{ teamStats.team_stats_losses }}</p>
                    <p><strong>Draws:</strong> {{ teamStats.team_stats_draws }}</p>
                  </b-col>

                  <!-- Chart or Message on the Right -->
                  <b-col md="6" class="d-flex justify-content-center align-items-center">
                    <div v-if="hasTeamData">
                      <canvas ref="teamStatsChart" class="small-chart"></canvas>
                    </div>
                    <div v-else>
                      <p>No data is available</p>
                    </div>
                  </b-col>
                </b-row>
              </b-card>
            </div>
          </div>
        </b-col>
      </b-row>
    </b-container>
  </div>
</template>

<script>
import { mapActions, mapGetters } from 'vuex';
import Chart from 'chart.js/auto';
import { nextTick } from 'vue';

export default {
  name: 'AdminStatistics',
  data() {
    return {
      isLoading: true,
      error: null,
      stats: [],
      playerOptions: [],      // Options for player dropdown
      teamOptions: [],        // Options for team dropdown
      selectedPlayerId: null, // Selected player ID
      selectedTeamId: null,   // Selected team ID
      playerStats: null,      // Stats of the selected player
      teamStats: null,        // Stats of the selected team
      playerStatsChart: null, // Chart instance for player stats
      teamStatsChart: null    // Chart instance for team stats
    };
  },
  computed: {
    ...mapGetters(['totalPlayers', 'totalTournaments', 'totalTeams', 'totalActivities']),
    hasPlayerData() {
      return this.playerStats &&
          (this.playerStats.player_stats_total_matches > 0 ||
              this.playerStats.player_stats_wins > 0 ||
              this.playerStats.player_stats_losses > 0 ||
              this.playerStats.player_stats_draws > 0);
    },
    hasTeamData() {
      return this.teamStats &&
          (this.teamStats.team_stats_total_matches > 0 ||
              this.teamStats.team_stats_wins > 0 ||
              this.teamStats.team_stats_losses > 0 ||
              this.teamStats.team_stats_draws > 0);
    }
  },
  methods: {
    ...mapActions(['fetchPlayers', 'fetchTeams', 'fetchPlayerStats', 'fetchTeamStats', 'fetchTournaments', 'fetchActivities']),

    async loadStatistics() {
      try {
        this.isLoading = true;
        this.error = null;

        // Fetch general stats
        await Promise.all([this.fetchPlayers(), this.fetchTeams(), this.fetchTournaments(), this.fetchActivities()]);

        // Set general statistics
        this.stats = [
          { label: 'Total Players', value: this.totalPlayers },
          { label: 'Total Tournaments', value: this.totalTournaments },
          { label: 'Total Teams', value: this.totalTeams },
          { label: 'Total Activities', value: this.totalActivities }
        ];

        // Set player options (only players with account_type "player")
        const players = await this.fetchPlayers();
        if (Array.isArray(players)) {
          this.playerOptions = players
              .filter(player => player.player_account_type === 'player') // Only players
              .map(player => ({ value: player.player_id, text: `${player.player_name} ${player.player_lastname}` }));
        }

        // Set team options
        const teams = await this.fetchTeams();
        if (Array.isArray(teams)) {
          this.teamOptions = teams.map(team => ({ value: team.team_id, text: team.team_name }));
        }
      } catch (error) {
        this.error = 'Failed to load statistics.';
        console.error(error);
      } finally {
        this.isLoading = false;
      }
    },

    async loadPlayerStats() {
      if (!this.selectedPlayerId) {
        this.playerStats = null;
        if (this.playerStatsChart) {
          this.playerStatsChart.destroy();
          this.playerStatsChart = null;
        }
        return;
      }

      try {
        const stats = await this.fetchPlayerStats(this.selectedPlayerId);

        this.playerStats = stats[0] || { player_stats_total_matches: 0, player_stats_wins: 0, player_stats_losses: 0, player_stats_draws: 0 };

        this.updatePlayerStatsChart();
      } catch (error) {
        console.error('Error loading player stats:', error);
        this.error = 'Failed to load player statistics.';
      }
    },

    async loadTeamStats() {
      if (!this.selectedTeamId) {
        this.teamStats = null;
        if (this.teamStatsChart) {
          this.teamStatsChart.destroy();
          this.teamStatsChart = null;
        }
        return;
      }

      try {
        const stats = await this.fetchTeamStats(this.selectedTeamId);

        // Make sure we are accessing the first element in the array if it exists
        this.teamStats = stats[0] || { team_stats_total_matches: 0, team_stats_wins: 0, team_stats_losses: 0, team_stats_draws: 0 };

        this.updateTeamStatsChart();
      } catch (error) {
        console.error('Error loading team stats:', error);
        this.error = 'Failed to load team statistics.';
      }
    },

    async updatePlayerStatsChart() {
      if (this.playerStatsChart) this.playerStatsChart.destroy();
      await nextTick();

      if (!this.hasPlayerData) return;

      this.playerStatsChart = new Chart(this.$refs.playerStatsChart, {
        type: 'doughnut',
        data: {
          labels: ['Wins', 'Losses', 'Draws'],
          datasets: [{
            data: [this.playerStats.player_stats_wins, this.playerStats.player_stats_losses, this.playerStats.player_stats_draws],
            backgroundColor: ['#4CAF50', '#F44336', '#FFC107']
          }]
        },
        options: { responsive: true, plugins: { legend: { position: 'top' } } }
      });
    },

    async updateTeamStatsChart() {
      if (this.teamStatsChart) this.teamStatsChart.destroy();
      await nextTick();

      if (!this.hasTeamData) return;

      this.teamStatsChart = new Chart(this.$refs.teamStatsChart, {
        type: 'doughnut',
        data: {
          labels: ['Wins', 'Losses', 'Draws'],
          datasets: [{
            data: [this.teamStats.team_stats_wins, this.teamStats.team_stats_losses, this.teamStats.team_stats_draws],
            backgroundColor: ['#4CAF50', '#F44336', '#FFC107']
          }]
        },
        options: { responsive: true, plugins: { legend: { position: 'top' } } }
      });
    }
  },
  mounted() {
    this.loadStatistics();
  },
};
</script>

<style scoped>
.admin-statistics {
  color: var(--navyblue);
}
p {
  font-family: "Montserrat", sans-serif;
  font-weight: bold;
}
.statistics-cards {
  margin-right: 20px;
}

.stat-card {
  padding: 10px;
}

.stat-value {
  font-size: 1.5rem;
  font-weight: bold;
}

.selection-section {
  display: flex;
  flex-direction: column;
}

.small-chart {
  width: 320px;
  height: 250px;
}
</style>