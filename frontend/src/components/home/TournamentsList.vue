<!-- src/components/TournamentsList.vue -->
<template>
  <div class="tournaments-list">
    <b-container class="mt-5 pt-5">
      <h2 class="text-center mb-4">Tournaments</h2>

      <!-- Filter Controls -->
      <div class="filters mb-3">
        <!-- Search Filter -->
        <b-input-group class="mb-3">
          <b-form-input
              v-model="filter"
              placeholder="Search Tournaments"
              aria-label="Search Tournaments"
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
            <b-form-group class="date" label="Filter by Date Range">
              <b-form-datepicker
                  v-model="dateRange"
                  range
                  aria-label="Select date range"
                  :state="dateRangeState"
                  class="magical-brush"
              ></b-form-datepicker>
            </b-form-group>
          </b-col>

          <!-- Game Filter (Optional) -->
          <b-col md="6" class="mb-3">
            <b-form-group label="Filter by Game">
              <b-form-select
                  v-model="selectedGame"
                  :options="gameOptions"
                  aria-label="Filter by game"
                  :state="gameState"
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
          v-if="!isLoading && !error && paginatedTournaments.length === 0"
          class="text-center my-4"
      >
        <p>No tournaments found.</p>
      </div>

      <!-- Tournaments Table -->
      <b-table
          v-if="!isLoading && !error && paginatedTournaments.length > 0"
          :items="paginatedTournaments"
          :fields="fields"
          striped
          hover
          responsive
          aria-label="Tournaments Table"
      >
        <!-- Custom Date Formatting -->
        <template #cell(start_time)="data">
          {{ formatDate(data.item.start_time) }}
        </template>
        <template #cell(end_time)="data">
          {{ formatDate(data.item.end_time) }}
        </template>
      </b-table>

      <!-- Pagination Controls -->
      <b-pagination
          v-if="!isLoading && !error && filteredTournaments.length > perPage"
          v-model="currentPage"
          :total-rows="filteredTournaments.length"
          :per-page="perPage"
          align="center"
          class="my-4 pagination"
          aria-label="Tournaments Pagination"
      ></b-pagination>
    </b-container>
  </div>
</template>

<script>
import dayjs from 'dayjs';
import { mapGetters, mapActions } from 'vuex';

export default {
  name: 'TournamentsList',
  computed: {
    // Access tournaments from Vuex store
    ...mapGetters(['allTournaments']),
    // Processed tournaments with additional formatting if needed
    tournaments() {
      return this.allTournaments.map((tournament) => ({
        ...tournament,
        // Add any additional processing if required
      }));
    },
    // Generate options for game filter
    gameOptions() {
      // Extract unique games from tournaments
      const games = [
        ...new Set(this.tournaments.map((tournament) => tournament.game)),
      ];
      return [
        { value: null, text: 'All Games' },
        ...games.map((game) => ({ value: game, text: game })),
      ];
    },
    // Sort options for the sort dropdown
    sortOptions() {
      return [
        { value: null, text: 'No Sorting' },
        { value: { key: 'name', order: 'asc' }, text: 'Name (A-Z)' },
        { value: { key: 'name', order: 'desc' }, text: 'Name (Z-A)' },
        { value: { key: 'game', order: 'asc' }, text: 'Game (A-Z)' },
        { value: { key: 'game', order: 'desc' }, text: 'Game (Z-A)' },
        { value: { key: 'start_time', order: 'asc' }, text: 'Start Time (Oldest First)' },
        { value: { key: 'start_time', order: 'desc' }, text: 'Start Time (Newest First)' },
        { value: { key: 'end_time', order: 'asc' }, text: 'End Time (Oldest First)' },
        { value: { key: 'end_time', order: 'desc' }, text: 'End Time (Newest First)' },
      ];
    },
    // Computed property for filtered tournaments based on all filters
    filteredTournaments() {
      let filtered = this.tournaments;

      // Apply text filter
      if (this.filter) {
        const searchTerm = this.filter.toLowerCase();
        filtered = filtered.filter((tournament) =>
            Object.values(tournament).some((value) =>
                String(value).toLowerCase().includes(searchTerm)
            )
        );
      }

      // Apply date range filter
      if (this.dateRange && this.dateRange.length === 2) {
        const [startDate, endDate] = this.dateRange;
        filtered = filtered.filter((tournament) => {
          const tournamentStart = dayjs(tournament.start_time);
          const tournamentEnd = dayjs(tournament.end_time);
          return (
              tournamentStart.isAfter(dayjs(startDate).subtract(1, 'day')) &&
              tournamentEnd.isBefore(dayjs(endDate).add(1, 'day'))
          );
        });
      }

      // Apply game filter
      if (this.selectedGame) {
        filtered = filtered.filter(
            (tournament) => tournament.game === this.selectedGame
        );
      }

      // Apply sorting
      if (this.sortOption && this.sortOption.key) {
        const { key, order } = this.sortOption;
        filtered.sort((a, b) => {
          let comparison = 0;
          if (a[key] > b[key]) comparison = 1;
          if (a[key] < b[key]) comparison = -1;
          return order === 'asc' ? comparison : -comparison;
        });
      }

      return filtered;
    },
    // Computed property for paginated tournaments
    paginatedTournaments() {
      const start = (this.currentPage - 1) * this.perPage;
      const end = this.currentPage * this.perPage;
      return this.filteredTournaments.slice(start, end);
    },
    // State for date range picker validation
    dateRangeState() {
      if (!this.dateRange || this.dateRange.length !== 2) return null;
      const [startDate, endDate] = this.dateRange;
      return startDate && endDate ? true : false;
    },
    // State for game select validation
    gameState() {
      return this.selectedGame !== null ? true : null;
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
      selectedGame: null,
      sortOption: null,
      fields: [
        { key: 'name', label: 'Name', sortable: true },
        { key: 'game', label: 'Game', sortable: true },
        { key: 'start_time', label: 'Start Time', sortable: true },
        { key: 'end_time', label: 'End Time', sortable: true },
      ],
      currentPage: 1,
      perPage: 10,
      loading: false,
      fetchError: null,
    };
  },
  methods: {
    /**
     * Fetch tournaments from the Vuex store
     */
    ...mapActions(['fetchTournaments']),
    fetchData() {
      this.loading = true;
      this.fetchError = null;
      this.fetchTournaments()
          .catch((error) => {
            this.fetchError = 'Failed to load tournaments.';
            console.error('Error fetching tournaments:', error);
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
      this.selectedGame = null;
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
    selectedGame() {
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

select, input {
  font-family: 'Montserrat', sans-serif;
  font-weight: bold;
  color: gray;
  letter-spacing : 1px;
  font-size: 15px;
}

.date {
  font-family: 'Montserrat', sans-serif;
  font-weight: bold;
  color: gray;
  letter-spacing : 1px;
  font-size: 15px;}


/* Additional Styling */
.tournaments-list {
  color: var(--navyblue);
}

.pagination .page-link {
  cursor: pointer;
}
</style>
