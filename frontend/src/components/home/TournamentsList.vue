<!-- src/components/TournamentsList.vue -->
<template>
  <div class="tournaments-list">
    <b-container class="mt-5 pt-5">
      <h2 class="text-center mb-4">Tournaments</h2>

      <!-- Search Filter -->
      <b-input-group class="mb-3">
        <b-form-input
            v-model="filter"
            placeholder="Search Tournaments"
            aria-label="Search Tournaments"
        ></b-form-input>
        <b-input-group-append>
          <b-button
              variant="outline-secondary"
              @click="clearFilter"
              aria-label="Clear Search"
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
          v-if="!isLoading && !error && tournaments.length === 0"
          class="text-center my-4"
      >
        <p>No tournaments found.</p>
      </div>

      <!-- Tournaments Table -->
      <b-table
          v-if="!isLoading && !error && tournaments.length > 0"
          :items="paginatedTournaments"
          :fields="fields"
          :filter="filter"
          :filter-included-fields="filterFields"
          striped
          hover
          responsive
          aria-label="Tournaments Table"
      >
        <!-- Optional: Customize cell rendering if needed -->
        <template #cell(start_time)="data">
          {{ formatDate(data.item.start_time) }}
        </template>
        <template #cell(end_time)="data">
          {{ formatDate(data.item.end_time) }}
        </template>
      </b-table>

      <!-- Pagination Controls -->
      <b-pagination
          v-if="!isLoading && !error && tournaments.length > perPage"
          v-model="currentPage"
          :total-rows="tournaments.length"
          :per-page="perPage"
          align="center"
          class="my-4"
          aria-label="Tournaments Pagination"
      ></b-pagination>
    </b-container>
  </div>
</template>

<script>
import dayjs from 'dayjs';

export default {
  name: 'TournamentsList',
  computed: {
    // Access tournaments from Vuex store
    tournaments() {
      return this.$store.getters.allTournaments;
    },
    // Access loading state
    isLoading() {
      return this.loading;
    },
    // Access error message
    error() {
      return this.fetchError;
    },
    // Computed property for paginated tournaments
    paginatedTournaments() {
      const start = (this.currentPage - 1) * this.perPage;
      const end = this.currentPage * this.perPage;
      return this.tournaments.slice(start, end);
    },
  },
  data() {
    return {
      filter: '',
      filterFields: ['name', 'game', 'start_time', 'end_time'],
      fields: [
        { key: 'name', label: 'Name', sortable: true },
        { key: 'game', label: 'Game', sortable: true },
        { key: 'start_time', label: 'Start Time', sortable: true },
        { key: 'end_time', label: 'End Time', sortable: true },
      ],
      loading: false,
      fetchError: null,
      currentPage: 1,
      perPage: 10,
    };
  },
  methods: {
    /**
     * Fetch tournaments from the backend via Vuex action
     */
    fetchData() {
      this.loading = true;
      this.fetchError = null;
      this.$store
          .dispatch('fetchTournaments')
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
     * Clear the search filter
     */
    clearFilter() {
      this.filter = '';
    },
  },
  mounted() {
    this.fetchData();
  },
};
</script>

<style scoped>
.tournaments-list {
  color: var(--navyblue);
}


</style>
