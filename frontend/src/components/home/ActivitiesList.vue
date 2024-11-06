<!-- src/components/ActivitiesList.vue -->
<template>
  <div class="activities">
    <br>
    <b-container class="mt-5 pt-5">
      <h2 class="text-center mb-4">Activities</h2>
    <br>
      <!-- Filter Controls -->
      <div class="filters mb-3">
        <!-- Search Filter -->
        <b-input-group class="mb-3">
          <b-form-input
              v-model="filter"
              placeholder="Search Activities"
              aria-label="Search Activities"
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

        <!-- Date Range Filter -->
        <b-row>
          <b-col md="6" class="mb-3">
            <b-form-group class='date' label="Filter by Date Range">
              <b-form-datepicker
                  v-model="dateRange"
                  range
                  aria-label="Select date range"
                  :state="dateRangeState"
              ></b-form-datepicker>
            </b-form-group>
          </b-col>

          <!-- Tournament Filter -->
          <b-col md="6" class="mb-3">
            <b-form-group label="Filter by Tournament">
              <b-form-select
                  v-model="selectedTournament"
                  :options="tournamentOptions"
                  aria-label="Filter by tournament"
                  :state="tournamentState"
              ></b-form-select>
            </b-form-group>
          </b-col>
        </b-row>

        <!-- Sorting Option -->
        <b-form-group label="Sort by">
          <b-form-select v-model="sortOption" :options="sortOptions"></b-form-select>
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
          v-if="!isLoading && !error && paginatedActivities.length === 0"
          class="text-center my-4"
      >
        <p>No activities found.</p>
      </div>

      <!-- Activities Table -->
      <b-table
          v-if="!isLoading && !error && paginatedActivities.length > 0"
          :items="paginatedActivities"
          :fields="fields"
          striped
          hover
          responsive
          aria-label="Activities Table"
      >
        <!-- Custom Date Formatting -->
        <template #cell(date)="data">
          {{ formatDate(data.item.date) }}
        </template>
        <template #cell(tournament)="data">
          {{ data.item.tournament }}
        </template>
      </b-table>

      <!-- Pagination Controls -->
      <b-pagination
          v-if="!isLoading && !error && filteredActivities.length > perPage"
          v-model="currentPage"
          :total-rows="filteredActivities.length"
          :per-page="perPage"
          align="center"
          class="my-4 pagination"
          aria-label="Activities Pagination"
      ></b-pagination>
    </b-container>
  </div>
</template>

<script>
import dayjs from 'dayjs';
import { mapGetters, mapActions } from 'vuex';

export default {
  name: 'ActivitiesList',
  isLoading: false,
  error: null,
  computed: {
    // Access activities from Vuex store
    ...mapGetters(['allActivities']),
    // Processed activities with tournament names
    activities() {
      return this.allActivities.map((activity) => ({
        ...activity,
        tournament: activity.tournament_id
            ? `Tournament ${activity.tournament_id}`
            : 'No Tournament',
      }));
    },
    // Generate options for tournament filter
    tournamentOptions() {
      // Extract unique tournaments from activities
      const tournaments = [...new Set(this.activities.map(activity => activity.tournament))];
      return [
        { value: null, text: 'All Tournaments' },
        ...tournaments.map(tournament => ({ value: tournament, text: tournament })),
      ];
    },
    // Sort options for the sort dropdown
    sortOptions() {
      return [
        { value: null, text: 'No Sorting' },
        { value: { key: 'name', order: 'asc' }, text: 'Name (A-Z)' },
        { value: { key: 'name', order: 'desc' }, text: 'Name (Z-A)' },
        { value: { key: 'date', order: 'asc' }, text: 'Date (Oldest First)' },
        { value: { key: 'date', order: 'desc' }, text: 'Date (Newest First)' },
        { value: { key: 'tournament', order: 'asc' }, text: 'Tournament (A-Z)' },
        { value: { key: 'tournament', order: 'desc' }, text: 'Tournament (Z-A)' },
      ];
    },
    // Computed property for filtered activities based on all filters
    filteredActivities() {
      let filtered = this.activities;

      // Apply text filter
      if (this.filter) {
        const searchTerm = this.filter.toLowerCase();
        filtered = filtered.filter(activity =>
            Object.values(activity).some(value =>
                String(value).toLowerCase().includes(searchTerm)
            )
        );
      }

      // Apply date range filter
      if (this.dateRange && this.dateRange.length === 2) {
        const [startDate, endDate] = this.dateRange;
        filtered = filtered.filter(activity => {
          const activityDate = dayjs(activity.date);
          return activityDate.isAfter(dayjs(startDate).subtract(1, 'day')) &&
              activityDate.isBefore(dayjs(endDate).add(1, 'day'));
        });
      }

      // Apply tournament filter
      if (this.selectedTournament) {
        filtered = filtered.filter(activity => activity.tournament === this.selectedTournament);
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
    // Computed property for paginated activities
    paginatedActivities() {
      const start = (this.currentPage - 1) * this.perPage;
      const end = this.currentPage * this.perPage;
      return this.filteredActivities.slice(start, end);
    },
    // State for date range picker validation
    dateRangeState() {
      if (!this.dateRange || this.dateRange.length !== 2) return null;
      const [startDate, endDate] = this.dateRange;
      return startDate && endDate ? true : false;
    },
    // State for tournament select validation
    tournamentState() {
      return this.selectedTournament !== null ? true : null;
    },
  },
  data() {
    return {
      filter: '',
      dateRange: [], // Holds [startDate, endDate]
      selectedTournament: null,
      sortOption: null,
      fields: [
        { key: 'name', label: 'Activity Name', sortable: true },
        { key: 'description', label: 'Description', sortable: false },
        { key: 'date', label: 'Date', sortable: true },
        { key: 'tournament', label: 'Tournament', sortable: true },
      ],
      currentPage: 1,
      perPage: 10,
      loading: false,
      fetchError: null,
    };
  },
  methods: {
    // Map Vuex actions
    ...mapActions(['fetchActivities']),
    /**
     * Fetch activities from the Vuex store
     */
    fetchData() {
      this.loading = true;
      this.fetchError = null;
      this.fetchActivities()
          .catch((error) => {
            this.fetchError = 'Failed to load activities.';
            console.error('Error fetching activities:', error);
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
      this.selectedTournament = null;
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
    selectedTournament() {
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
.activities {
  color: var(--navyblue);
}

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

</style>
