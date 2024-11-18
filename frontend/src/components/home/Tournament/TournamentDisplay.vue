<!-- TournamentDisplay.vue -->
<template>
  <div class="tournament-profile">
    <b-container class="mt-5 pt-5">
      <h2 class="text-center mb-4">Tournament</h2>

      <!-- Loading Indicator -->
      <div v-if="isLoading" class="text-center my-4">
        <b-spinner label="Loading..."></b-spinner>
      </div>

      <!-- Error Message -->
      <b-alert v-if="error" variant="danger" dismissible aria-live="assertive" class="my-4">
        {{ error }}
      </b-alert>

      <!-- Tournament Info -->
      <div v-if="!isLoading && !error && tournament">
        <b-card>
          <b-card-body>
            <h4>{{ tournament.tournament_name }}</h4>
            <p><strong>Start Time:</strong> {{ formatDate(tournament.tournament_start_time) }}</p>
            <p><strong>Best of:</strong> {{ tournament.tournament_bestOfX }} rounds</p>
            <p><strong>Pool Size:</strong> {{ tournament.tournament_poolSize }}</p>
            <p><strong>Type:</strong> {{ tournament.tournament_type_name || 'N/A' }}</p>
            <p><strong>Format:</strong> {{ tournament.format_name || 'N/A' }}</p>
            <p><strong>Rules:</strong> {{ tournament.rules_ruleSet }}</p>
            <p><strong>Activity:</strong> {{ tournament.activity_name }}
              ({{ tournament.activity_category }})</p>
            <p><strong>Number of Players:</strong> {{ tournament.activity_number_of_players }}</p>
            <p><strong>Activity Type:</strong> {{ tournament.activity_type }}</p>

            <!-- Players Table -->
            <div v-if="tournament.players && tournament.players.length">
              <h5 class="mt-4">Players:</h5>
              <b-table :items="tournament.players" :fields="playerFields" responsive bordered>
                <template #cell(player_id)="data">
                  {{ data.item.player_id }}
                </template>
                <template #cell(player_nickname)="data">
                  {{ data.item.player_nickname }}
                </template>
              </b-table>
            </div>
          </b-card-body>
        </b-card>
      </div>
    </b-container>
  </div>
</template>

<script>
import { mapGetters } from 'vuex';
import dayjs from 'dayjs';

export default {
  name: 'TournamentProfile',
  computed: {
    ...mapGetters(['allTournaments']),
    tournament() {
      const tournament = this.allTournaments.find(
          (tournament) => tournament.tournament_id === parseInt(this.tournamentId)
      );

      // Check if tournament.players is a string, and if so, parse it as JSON
      if (tournament && typeof tournament.players === 'string') {
        try {
          tournament.players = JSON.parse(tournament.players);
        } catch (error) {
          console.error('Error parsing players data:', error);
        }
      }

      return tournament;
    },
    isLoading() {
      return this.loading;
    },
    error() {
      return this.fetchError;
    },
  },
  data() {
    return {
      tournamentId: this.$route.params.id, // Get the tournament ID from route params
      loading: false,
      fetchError: null,
      playerFields: [
        { key: 'player_id', label: 'Player ID' },
        { key: 'player_nickname', label: 'Nickname' }
      ],
    };
  },
  mounted() {
    this.fetchTournamentData();
  },
  methods: {
    fetchTournamentData() {
      this.loading = true;
      this.fetchError = null;
      this.$store.dispatch('fetchTournaments') // Dispatch the action to fetch all tournaments
          .catch((error) => {
            this.fetchError = 'Failed to load tournament data.';
            console.error('Error fetching tournament data:', error);
          })
          .finally(() => {
            this.loading = false;
          });
    },
    formatDate(date) {
      return dayjs(date).format('MMMM D, YYYY [at] h:mm A');
    },
  },
};
</script>

<style scoped>
.tournament-profile {
  padding: 20px;
}
</style>
