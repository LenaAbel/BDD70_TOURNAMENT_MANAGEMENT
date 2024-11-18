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
        <template #cell(activity_name)="data">
          <router-link :to="`/activities/${data.item.activity_id}`">{{ data.item.activity_name }}</router-link>
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
import { mapGetters, mapActions } from 'vuex';

export default {
  name: 'ActivitiesList',
  computed: {
    // Access activities from Vuex store
    ...mapGetters(['allActivities']),
    activities() {
      return this.allActivities;
    },
    // Sort options for the sort dropdown
    sortOptions() {
      return [
        { value: null, text: 'No Sorting' },
        { value: { key: 'activity_name', order: 'asc' }, text: 'Name (A-Z)' },
        { value: { key: 'activity_name', order: 'desc' }, text: 'Name (Z-A)' },
      ];
    },
    // Computed property for filtered and sorted activities
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

      // Apply sorting
      if (this.sortOption && this.sortOption.key) {
        const { key, order } = this.sortOption;
        filtered = filtered.slice().sort((a, b) => {
          const aValue = a[key] ? a[key].toLowerCase() : '';
          const bValue = b[key] ? b[key].toLowerCase() : '';

          if (aValue < bValue) return order === 'asc' ? -1 : 1;
          if (aValue > bValue) return order === 'asc' ? 1 : -1;
          return 0;
        });
      }

      return filtered;
    },
    paginatedActivities() {
      const start = (this.currentPage - 1) * this.perPage;
      const end = this.currentPage * this.perPage;
      return this.filteredActivities.slice(start, end);
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
      filter: '',
      sortOption: null,
      fields: [
        { key: 'activity_name', label: 'Activity Name', sortable: true },
        { key: 'activity_description', label: 'Description', sortable: false },
        { key: 'activity_number_of_players', label: 'Player Number', sortable: true },
        { key: 'activity_category', label: 'Category', sortable: true },
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
    clearFilter() {
      this.filter = '';
      this.sortOption = null;
      this.currentPage = 1;
    },
  },
  watch: {
    // Reset to first page when filters change
    filter() {
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
  letter-spacing: 1px;
  font-size: 15px;
}
</style>
