<!-- src/components/Teams.vue -->
<template>
  <div class="teams">
    <b-container class="mt-5 pt-5">
      <h2 class="text-center mb-4">Teams</h2>

      <!-- Search Filter -->
      <b-input-group class="mb-3">
        <b-form-input
            v-model="filter"
            placeholder="Search Teams"
            aria-label="Search Teams"
            class="magical-brush"
        ></b-form-input>
        <b-input-group-append>
          <b-button
              variant="outline-secondary"
              @click="clearFilter"
              aria-label="Clear Search"
              class="magical-brush-button"
          >
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
      <div v-if="!isLoading && !error && filteredTeams.length === 0" class="text-center my-4">
        <p>No teams found.</p>
      </div>

      <!-- Teams Table -->
      <b-table
          v-if="!isLoading && !error && filteredTeams.length > 0"
          :items="paginatedTeams"
          :fields="fields"
          striped
          hover
          responsive
          aria-label="Teams Table"
      >
        <!-- Optional: Add slot for additional content if needed -->
      </b-table>

      <!-- Pagination Controls -->
      <b-pagination
          v-if="!isLoading && !error && filteredTeams.length > perPage"
          v-model="currentPage"
          :total-rows="filteredTeams.length"
          :per-page="perPage"
          align="center"
          class="my-4 pagination"
          aria-label="Teams Pagination"
      ></b-pagination>
    </b-container>
  </div>
</template>

<script>
export default {
  name: 'TeamsList',
  data() {
    return {
      teams: [],
      filter: '',
      fields: [
        { key: 'team_name', label: 'Team Name', sortable: true },
        { key: 'player_count', label: 'Number of Players', sortable: false },
      ],
      isLoading: false,
      error: null,
      currentPage: 1,
      perPage: 10,
    };
  },
  computed: {
    /**
     * Filtered teams based on the search input
     */
    filteredTeams() {
      if (!this.filter) {
        return this.teams;
      }
      const searchTerm = this.filter.toLowerCase();
      return this.teams.filter((team) => {
        return (
            team.team_name.toLowerCase().includes(searchTerm) ||
            String(team.player_count).toLowerCase().includes(searchTerm)
        );
      });
    },
    /**
     * Paginated teams for the current page
     */
    paginatedTeams() {
      const start = (this.currentPage - 1) * this.perPage;
      const end = this.currentPage * this.perPage;
      return this.filteredTeams.slice(start, end);
    },
  },
  methods: {
    /**
     * Fetch teams from the backend API
     */
    fetchTeams() {
      this.isLoading = true;
      this.error = null;
      this.$axios
          .get('team/')
          .then((response) => {
            this.teams = response.data.map((team) => ({
              ...team,
              player_count: team.player_count || 0, // Ensure player_count is a number
            }));
          })
          .catch((error) => {
            this.error = 'Failed to load teams.';
            console.error('Error fetching teams:', error);
          })
          .finally(() => {
            this.isLoading = false;
          });
    },
    /**
     * Clear the search filter and reset pagination
     */
    clearFilter() {
      this.filter = '';
      this.currentPage = 1;
    },
  },
  watch: {
    // Reset to first page when the filter changes
    filter() {
      this.currentPage = 1;
    },
  },
  mounted() {
    this.fetchTeams();
  },
};
</script>

<style scoped>
.teams {
  color: var(--navyblue);
}

/* Additional styles for the magical-brush font */
.magical-brush {
  font-family: 'MagicalBrush', cursive;
}

.magical-brush-button {
  font-family: 'MagicalBrush', cursive;
}
</style>
