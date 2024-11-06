<!-- src/components/Players.vue -->
<template>
  <div class="players">
    <b-container class="mt-5 pt-5">
      <h2 class="text-center mb-4">Players</h2>

      <!-- Search Filter -->
      <b-input-group class="mb-3">
        <b-form-input
            v-model="filter"
            placeholder="Search Players"
            aria-label="Search Players"
        ></b-form-input>
        <b-input-group-append>
          <b-button variant="outline-secondary" @click="filter = ''" aria-label="Clear Search">
            <b-icon icon="x-circle"></b-icon>
          </b-button>
        </b-input-group-append>
      </b-input-group>

      <!-- Loading Indicator -->
      <div v-if="isLoading" class="text-center my-4">
        <b-spinner label="Loading..."></b-spinner>
      </div>

      <!-- Error Message -->
      <b-alert v-if="error" variant="danger" dismissible>
        {{ error }}
      </b-alert>

      <!-- No Data Found Message -->
      <div v-if="!isLoading && !error && players.length === 0" class="text-center my-4">
        <p>No players found.</p>
      </div>

      <!-- Players Table -->
      <b-table
          v-if="!isLoading && !error && players.length > 0"
          :items="players"
          :fields="fields"
          :filter="filter"
          :filter-included-fields="filterFields"
          striped
          hover
          responsive
      >
        <!-- Optional: Add slot for additional content if needed -->
      </b-table>
    </b-container>
  </div>
</template>

<script>
export default {
  name: 'PlayersList',
  data() {
    return {
      players: [],
      filter: '',
      filterFields: ['name', 'email', 'preferredGames', 'team'],
      fields: [
        { key: 'name', label: 'Name', sortable: true },
        { key: 'email', label: 'Email', sortable: true },
        { key: 'preferredGames', label: 'Preferred Games', sortable: false },
        { key: 'team', label: 'Team', sortable: true },
      ],
      isLoading: false,
      error: null,
    };
  },
  methods: {
    fetchPlayers() {
      this.isLoading = true;
      this.error = null;
      this.$axios
          .get('players/') // Ensure the route matches your backend
          .then((response) => {
            this.players = response.data.map((player) => ({
              ...player,
              preferredGames: player.preferredGames ? player.preferredGames.join(', ') : 'N/A', // Assuming preferredGames is an array
              team: player.team_id ? `Team ${player.team_id}` : 'No Team',
            }));
          })
          .catch((error) => {
            this.error = 'Failed to load players.';
            console.error('Error fetching players:', error);
          })
          .finally(() => {
            this.isLoading = false;
          });
    },
  },
  mounted() {
    this.fetchPlayers();
  },
};
</script>

<style scoped>
.players {
  color: var(--navyblue);
}
</style>
