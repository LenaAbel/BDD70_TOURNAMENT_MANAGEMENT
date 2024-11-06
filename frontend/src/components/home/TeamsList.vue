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
      <div v-if="!isLoading && !error && teams.length === 0" class="text-center my-4">
        <p>No teams found.</p>
      </div>

      <!-- Teams Table -->
      <b-table
          v-if="!isLoading && !error && teams.length > 0"
          :items="teams"
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
  name: 'TeamsList',
  data() {
    return {
      teams: [],
      filter: '',
      filterFields: ['name', 'game', 'members'],
      fields: [
        { key: 'name', label: 'Team Name', sortable: true },
        { key: 'game', label: 'Game', sortable: true },
        { key: 'members', label: 'Members', sortable: false },
      ],
      isLoading: false,
      error: null,
    };
  },
  methods: {
    fetchTeams() {
      this.isLoading = true;
      this.error = null;
      this.$axios
          .get('team/') // Ensure the route matches your backend
          .then((response) => {
            this.teams = response.data.map((team) => ({
              ...team,
              members: team.members ? team.members.join(', ') : 'No Members', // Assuming members is an array
              game: team.game ? team.game : 'N/A',
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
</style>
