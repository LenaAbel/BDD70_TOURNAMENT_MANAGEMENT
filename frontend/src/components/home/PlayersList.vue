<!-- src/components/PlayersList.vue -->
<template>
  <div class="players">
    <b-container class="mt-5 pt-5">
      <h2 class="text-center mb-4">Players</h2>

      <!-- Filter Controls -->
      <div class="filters mb-3">
        <!-- Search Filter -->
        <b-input-group class="mb-3">
          <b-form-input
              v-model="filter"
              placeholder="Search Players"
              aria-label="Search Players"
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

        <!-- Date Range Filter -->
        <b-row>
          <b-col md="6" class="mb-3">
            <b-form-group class='date' label="Filter by Registration Date">
              <b-form-datepicker
                  v-model="dateRange"
                  range
                  aria-label="Select registration date range"
                  :state="dateRangeState"
                  class="magical-brush"
              ></b-form-datepicker>
            </b-form-group>
          </b-col>

          <!-- Team Filter -->
          <b-col md="6" class="mb-3">
            <b-form-group label="Filter by Team">
              <b-form-select
                  v-model="selectedTeam"
                  :options="teamOptions"
                  aria-label="Filter by team"
                  :state="teamState"
                  class="magical-brush"
              ></b-form-select>
            </b-form-group>
          </b-col>
        </b-row>

        <!-- Sorting Option -->
        <b-form-group label="Sort by">
          <b-form-select
              v-model="sortOption"
              :options="sortOptions"
              class="magical-brush"
          ></b-form-select>
        </b-form-group>
      </div>

      <!-- Loading Indicator -->
      <div v-if="isLoading" class="text-center my-4">
        <b-spinner label="Loading..."></b-spinner>
      </div>

      <!-- Error Message -->
      <b-alert
          v-if="error"
          variant="danger"
          dismissible
          aria-live="assertive"
          class="my-4"
      >
        {{ error }}
      </b-alert>

      <!-- No Data Found Message -->
      <div
          v-if="!isLoading && !error && paginatedPlayers.length === 0"
          class="text-center my-4"
      >
        <p>No players found.</p>
      </div>

      <!-- Players Table -->
      <b-table
          v-if="!isLoading && !error && paginatedPlayers.length > 0"
          :items="paginatedPlayers"
          :fields="fields"
          striped
          hover
          responsive
          aria-label="Players Table"
      >
        <!-- Optional: Customize cell rendering if needed -->
        <template #cell(preferredGames)="data">
          {{ data.item.preferredGames }}
        </template>
        <template #cell(team)="data">
          {{ data.item.team }}
        </template>
        <template #cell(registrationDate)="data">
          {{ formatDate(data.item.registrationDate) }}
        </template>
      </b-table>

      <!-- Pagination Controls -->
      <b-pagination
          v-if="!isLoading && !error && filteredPlayers.length > perPage"
          v-model="currentPage"
          :total-rows="filteredPlayers.length"
          :per-page="perPage"
          align="center"
          class="my-4 pagination"
          aria-label="Players Pagination"
      ></b-pagination>
    </b-container>
  </div>
</template>

<script>
import dayjs from 'dayjs';
import { mapGetters, mapActions } from 'vuex';

export default {
  name: 'PlayersList',
  computed: {
    // Access players from Vuex store
    ...mapGetters(['allPlayers']),
    // Processed players with team names and formatted preferred games
    players() {
      return this.allPlayers.map((player) => ({
        ...player,
        preferredGames: player.preferredGames
            ? player.preferredGames
            : 'N/A', // Assuming preferredGames is an array or a string
        team: player.team_name ? player.team_name : 'No Team',
        registrationDate: player.player_registrationDate
            ? player.player_registrationDate
            : null,
      }));
    },
    // Generate options for team filter
    teamOptions() {
      // Extract unique teams from players
      const teams = [...new Set(this.players.map((player) => player.team))];
      return [
        { value: null, text: 'All Teams' },
        ...teams.map((team) => ({ value: team, text: team })),
      ];
    },
    // Sort options for the sort dropdown
    sortOptions() {
      return [
        { value: null, text: 'No Sorting' },
        { value: { key: 'player_name', order: 'asc' }, text: 'Name (A-Z)' },
        { value: { key: 'player_name', order: 'desc' }, text: 'Name (Z-A)' },
        { value: { key: 'player_lastname', order: 'asc' }, text: 'Lastname (A-Z)' },
        { value: { key: 'player_lastname', order: 'desc' }, text: 'Lastname (Z-A)' },
        { value: { key: 'player_email', order: 'asc' }, text: 'Email (A-Z)' },
        { value: { key: 'player_email', order: 'desc' }, text: 'Email (Z-A)' },
        {
          value: { key: 'registrationDate', order: 'asc' },
          text: 'Registration Date (Oldest First)',
        },
        {
          value: { key: 'registrationDate', order: 'desc' },
          text: 'Registration Date (Newest First)',
        },
        { value: { key: 'team', order: 'asc' }, text: 'Team (A-Z)' },
        { value: { key: 'team', order: 'desc' }, text: 'Team (Z-A)' },
      ];
    },
    // Computed property for filtered players based on all filters
    filteredPlayers() {
      let filtered = this.players;

      // Apply text filter
      if (this.filter) {
        const searchTerm = this.filter.toLowerCase();
        filtered = filtered.filter((player) =>
            Object.values(player).some((value) =>
                String(value).toLowerCase().includes(searchTerm)
            )
        );
      }

      // Apply date range filter
      if (this.dateRange && this.dateRange.length === 2) {
        const [startDate, endDate] = this.dateRange;
        filtered = filtered.filter((player) => {
          if (!player.registrationDate) return false;
          const regDate = dayjs(player.registrationDate);
          return (
              regDate.isAfter(dayjs(startDate).subtract(1, 'day')) &&
              regDate.isBefore(dayjs(endDate).add(1, 'day'))
          );
        });
      }

      // Apply team filter
      if (this.selectedTeam) {
        filtered = filtered.filter((player) => player.team === this.selectedTeam);
      }

      // Apply sorting
      if (this.sortOption && this.sortOption.key) {
        const { key, order } = this.sortOption;
        filtered.sort((a, b) => {
          let comparison = 0;
          const valueA = a[key] ? a[key].toString().toLowerCase() : '';
          const valueB = b[key] ? b[key].toString().toLowerCase() : '';

          if (valueA > valueB) comparison = 1;
          if (valueA < valueB) comparison = -1;
          return order === 'asc' ? comparison : -comparison;
        });
      }

      return filtered;
    },
    // Computed property for paginated players
    paginatedPlayers() {
      const start = (this.currentPage - 1) * this.perPage;
      const end = this.currentPage * this.perPage;
      return this.filteredPlayers.slice(start, end);
    },
    // State for date range picker validation
    dateRangeState() {
      if (!this.dateRange || this.dateRange.length !== 2) return null;
      const [startDate, endDate] = this.dateRange;
      return startDate && endDate ? true : false;
    },
    // State for team select validation
    teamState() {
      return this.selectedTeam !== null ? true : null;
    },
    // Access loading state
    isLoading() {
      return this.loading;
    },
    // Access error message
    error() {
      return this.fetchError;
    },
  },
  data() {
    return {
      filter: '',
      dateRange: [], // Holds [startDate, endDate]
      selectedTeam: null,
      sortOption: null,
      fields: [
        { key: 'player_name', label: 'Name', sortable: true },
        { key: 'player_lastname', label: 'Lastname', sortable: true },
        { key: 'player_email', label: 'Email', sortable: true },
        { key: 'preferredGames', label: 'Preferred Games', sortable: false },
        { key: 'team', label: 'Team', sortable: true },
        { key: 'registrationDate', label: 'Registration Date', sortable: true },
      ],
      currentPage: 1,
      perPage: 10,
      loading: false,
      fetchError: null,
    };
  },
  methods: {
    // Map Vuex actions
    ...mapActions(['fetchPlayers']),
    /**
     * Fetch players from the Vuex store
     */
    fetchData() {
      this.loading = true;
      this.fetchError = null;
      this.fetchPlayers()
          .catch((error) => {
            this.fetchError = 'Failed to load players.';
            console.error('Error fetching players:', error);
          })
          .finally(() => {
            this.loading = false;
          });
    },
    /**
     * Format date using Day.js
     * @param {string} date - Date string to format
     * @returns {string} - Formatted date
     */
    formatDate(date) {
      return dayjs(date).format('MMMM D, YYYY');
    },
    /**
     * Clear all filters
     */
    clearFilter() {
      this.filter = '';
      this.dateRange = [];
      this.selectedTeam = null;
      this.sortOption = null;
      this.currentPage = 1;
    },
  },
  watch: {
    // Reset to first page when filters change
    filter() {
      this.currentPage = 1;
    },
    dateRange() {
      this.currentPage = 1;
    },
    selectedTeam() {
      this.currentPage = 1;
    },
    sortOption() {
      this.currentPage = 1;
    },
  },
  mounted() {
    this.fetchData();
  },
};
</script>

<style scoped>
.players {
  color: var(--navyblue);
}
</style>
