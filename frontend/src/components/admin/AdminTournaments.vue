<!-- AdminTournaments.vue -->
<template>
  <div class="tournaments-list">
    <b-container class="mt-5 pt-5">
      <h2 class="text-center mb-4">Manage Tournaments</h2>

      <!-- Add New Tournament Button -->
      <div class="text-right mb-3">
        <b-button variant="success" @click="openAddModal">
          <b-icon icon="plus-circle"></b-icon> Add Tournament
        </b-button>
      </div>

      <!-- Filter Controls -->
      <div class="filters mb-3">
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

      <!-- Tournaments Table with Edit/Delete Actions -->
      <b-table
          v-if="!isLoading && !error && paginatedTournaments.length > 0"
          :items="paginatedTournaments"
          :fields="fields"
          striped
          hover
          responsive
          aria-label="Manage Tournaments Table"
      >
        <template #cell(tournament_start_time)="data">
          {{ formatDate(data.item.tournament_start_time) }}
        </template>
        <template #cell(tournament_name)="data">
          <router-link :to="`/tournaments/${data.item.tournament_id}`">{{ data.item.tournament_name }}</router-link>
        </template>
        <template #cell(actions)="data">
          <b-button size="sm" variant="warning" style="margin: 10px" @click="editTournament(data.item)">
            <b-icon icon="pencil-square"></b-icon> Edit
          </b-button>

          <b-button size="sm" variant="danger" @click="deleteTournament(data.item.tournament_id)">
            <b-icon icon="trash"></b-icon> Delete
          </b-button>
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

      <!-- Add/Edit Tournament Modal -->
      <b-modal :key="modalKey" v-model="showAddModal" title="Add Tournament" @hide="clearForm" hide-footer>
        <b-form @submit.prevent="submitForm">
          <b-form-group label="Tournament Name">
            <b-form-input
                v-model="form.tournament_name"
                ref="tournamentNameInput"
                @click="focusTournamentName"
                required
            ></b-form-input>
          </b-form-group>

          <b-form-group label="Game" v-if="gameOptions && gameOptions.length > 0">
            <b-form-select
                v-model="form.activity_id"
                :options="gameOptions"
                @change="assignRuleId"
                required
            ></b-form-select>
          </b-form-group>

          <b-form-group label="Start Time">
            <b-form-datepicker v-model="form.tournament_start_time" required></b-form-datepicker>
          </b-form-group>

          <b-form-group label="Best of X">
            <b-form-input type="number" v-model="form.tournament_bestOfX" min="1"></b-form-input>
          </b-form-group>

          <b-form-group label="Pool Size">
            <b-form-input type="number" v-model="form.tournament_poolSize" min="2"></b-form-input>
          </b-form-group>

          <b-form-group label="Type">
            <b-form-select
                v-model="form.tournament_type"
                :options="[{ value: 'solo', text: 'Solo' }, { value: 'team', text: 'Team' }]"
                required
            ></b-form-select>
          </b-form-group>

          <b-form-group label="Format">
            <b-form-select
                v-model="form.tournament_format"
                :options="[ { value: 'elimination', text: 'Elimination' }, { value: 'round_robin', text: 'Round Robin' }, { value: 'swiss', text: 'Swiss' } ]"
            ></b-form-select>
          </b-form-group>

          <b-form-group label="Organizer">
            <b-form-select
                v-model="form.organizer_id"
                :options="organizerOptions"
                required
                @change="validateEmail"
            ></b-form-select>
            <b-form-invalid-feedback v-if="emailInvalid">Organizer email must contain "@"</b-form-invalid-feedback>
          </b-form-group>

          <!-- Save Changes Button -->
          <b-button type="submit" variant="primary" :disabled="emailInvalid || !form.tournament_name">
            {{ editing ? 'Save 💾' : 'Add +' }}
          </b-button>
        </b-form>
      </b-modal>
    </b-container>
  </div>
</template>

<script>
import dayjs from 'dayjs';
import { mapGetters, mapActions } from 'vuex';

export default {
  name: 'AdminTournaments',
  data() {
    return {
      showAddModal: false,
      editing: false,
      modalKey: 0,
      emailInvalid: false, // Track email validation status
      form: {
        tournament_name: '',
        activity_id: null,
        tournament_start_time: null,
        tournament_bestOfX: null,
        tournament_poolSize: null,
        tournament_type: 'solo',
        tournament_format: 'elimination',
        rule_id: null,
        organizer_id: null,
      },
      filter: '',
      fields: [
        { key: 'tournament_name', label: 'Name', sortable: true },
        { key: 'activity_name', label: 'Game', sortable: true },
        { key: 'tournament_start_time', label: 'Start Time', sortable: true },
        { key: 'actions', label: 'Actions' },
      ],
      currentPage: 1,
      perPage: 10,
      loading: false,
      fetchError: null,
      gameOptions: [],
      organizerOptions: [],
    };
  },
  computed: {
    ...mapGetters(['allTournaments', 'allActivities', 'allOrganizers']),
    tournaments() {
      return this.allTournaments;
    },
    filteredTournaments() {
      let filtered = this.tournaments;

      if (this.filter) {
        const searchTerm = this.filter.toLowerCase();
        filtered = filtered.filter((tournament) =>
            Object.values(tournament).some((value) =>
                String(value).toLowerCase().includes(searchTerm)
            )
        );
      }

      return filtered;
    },
    paginatedTournaments() {
      const start = (this.currentPage - 1) * this.perPage;
      const end = this.currentPage * this.perPage;
      return this.filteredTournaments.slice(start, end);
    },
    isLoading() {
      return this.loading;
    },
    error() {
      return this.fetchError;
    },
  },
  methods: {
    ...mapActions(['fetchTournaments', 'fetchActivities', 'fetchOrganizers', 'createTournament', 'updateTournament', 'deleteTournament']),
    fetchData() {
      this.loading = true;
      this.fetchError = null;

      Promise.all([this.fetchTournaments(), this.fetchActivities(), this.fetchOrganizers()])
          .then(() => {
            // Populate game options
            if (this.allActivities && this.allActivities.length > 0) {
              this.gameOptions = this.allActivities.map(activity => ({
                value: activity.activity_id,
                text: activity.activity_name,
              }));
            } else {
              console.warn("No activities found in allActivities.");
            }

            // Populate organizer options
            if (this.allOrganizers && this.allOrganizers.length > 0) {
              this.organizerOptions = this.allOrganizers.map(organizer => ({
                value: organizer.player_id,
                text: `${organizer.player_name} ${organizer.player_lastname}`,
                email: organizer.player_email, // Track email for validation
              }));
            } else {
              console.warn("No organizers found in allOrganizers.");
            }
          })
          .catch(error => {
            this.fetchError = 'Failed to load tournaments, activities, or organizers.';
            console.error('Error fetching data:', error);
          })
          .finally(() => {
            this.loading = false;
          });
    },
    validateEmail() {
      // Check the selected organizer's email to see if it contains '@'
      const selectedOrganizer = this.organizerOptions.find(o => o.value === this.form.organizer_id);
      this.emailInvalid = selectedOrganizer && !selectedOrganizer.email.includes('@');
    },
    editTournament(tournament) {
      this.form = {
        tournament_id: tournament.tournament_id,
        tournament_name: tournament.tournament_name,
        activity_id: tournament.activity_id,
        tournament_start_time: tournament.tournament_start_time,
        tournament_bestOfX: tournament.tournament_bestOfX,
        tournament_poolSize: tournament.tournament_poolSize,
        tournament_type: tournament.tournament_type,
        tournament_format: tournament.tournament_format,
        rule_id: tournament.rule_id,
        organizer_id: tournament.organizer_id,
      };
      this.editing = true;
      this.showAddModal = true;
    },
    formatDate(date) {
      return dayjs(date).format('MMMM D, YYYY');
    },
    clearFilter() {
      this.filter = '';
      this.currentPage = 1;
    },
    clearForm() {
      this.form = {
        tournament_id: null,
        tournament_name: '',
        activity_id: null,
        tournament_start_time: null,
        tournament_bestOfX: null,
        tournament_poolSize: null,
        tournament_type: 'solo',
        tournament_format: 'elimination',
        rule_id: null,
        organizer_id: null,
      };
      this.editing = false;
      this.$forceUpdate();
    },
    focusTournamentName() {
      this.$nextTick(() => {
        this.$refs.tournamentNameInput.focus();
      });
    },
    assignRuleId() {
      const selectedActivity = this.allActivities.find(activity => activity.activity_id === this.form.activity_id);

      if (selectedActivity && selectedActivity.rule_id) {
        this.form.rule_id = selectedActivity.rule_id;
      } else {
        console.error("No rule_id found for the selected activity.");
      }
    },
    submitForm() {
      const formData = {
        name: this.form.tournament_name,
        start_time: this.form.tournament_start_time,
        bestofX: this.form.tournament_bestOfX,
        poolSize: this.form.tournament_poolSize,
        type: this.form.tournament_type,
        format: this.form.tournament_format,
        rule_id: this.form.rule_id,
        organizer_id: this.form.organizer_id
      };

      if (!formData.rule_id || this.emailInvalid) {
        alert("Please select a valid game and ensure the associated rule and valid email are set.");
        return;
      }

      if (this.editing) {
        // Call updateTournament if editing
        this.updateTournament({ tournamentId: this.form.tournament_id, tournamentData: formData })
            .then(() => {
              this.showAddModal = false;
              this.fetchData();
            })
            .catch(error => console.error('Error updating tournament:', error));
      } else {
        // Call createTournament if adding a new tournament
        this.createTournament(formData)
            .then(() => {
              this.showAddModal = false;
              this.fetchData();
            })
            .catch(error => console.error('Error creating tournament:', error));
      }
    },
    async deleteTournament(tournamentId) {
      const confirmed = confirm('Are you sure you want to delete this tournament?');
      if (confirmed) {
        try {
          await this.$store.dispatch('deleteTournament', tournamentId);
          window.location.reload(); // This will reload the page
        } catch (error) {
          console.error('Error deleting tournament:', error);
        }
      }
    },
    openAddModal() {
      this.clearForm();
      this.modalKey += 1;
      this.showAddModal = true;
    },
  },
  mounted() {
    this.fetchData();
  },
  watch: {
    'form.organizer_id': function (newVal) {
      console.log("Selected organizer_id:", newVal);
      this.validateEmail(); // Validate email each time organizer changes
    }
  },
};
</script>
