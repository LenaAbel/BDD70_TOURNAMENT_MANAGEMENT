<template>
  <div class="admin-teams">
    <b-container class="mt-5 pt-5">
      <h2 class="text-center mb-4">Manage Teams</h2>

      <!-- Add New Team Button -->
      <div class="text-right mb-3">
        <b-button variant="success" @click="openAddModal">
          <b-icon icon="plus-circle"></b-icon> Add Team
        </b-button>
      </div>

      <!-- Search Filter -->
      <b-input-group class="mb-3">
        <b-form-input
            v-model="filter"
            placeholder="Search Teams"
            aria-label="Search Teams"
            class="magical-brush"
        ></b-form-input>
        <b-input-group-append>
          <b-button variant="outline-secondary" @click="clearFilter">
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

      <!-- Teams Table with Edit/Delete Actions -->
      <b-table
          v-if="!isLoading && !error && filteredTeams.length > 0"
          :items="filteredTeams"
          :fields="fields"
          :key="teamsTableKey"
          striped
          hover
          responsive
          aria-label="Teams Table"
      >
        <template #cell(actions)="data">
          <b-button size="sm" variant="warning" style="margin: 10px" @click="editTeam(data.item)">
            <b-icon icon="pencil-square"></b-icon> Edit
          </b-button>
          <b-button size="sm" variant="danger" @click="confirmDeleteTeam(data.item.team_id)">
            <b-icon icon="trash"></b-icon> Delete
          </b-button>
        </template>
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

      <!-- Add/Edit Team Modal -->
      <b-modal v-model="showModal" :title="editing ? 'Edit Team' : 'Add Team'" @hide="clearForm" hide-footer>
        <b-form @submit.prevent="submitForm">
          <b-form-group label="Team Name">
            <b-form-input v-model="form.team_name" required placeholder="Enter team name"></b-form-input>
          </b-form-group>

          <!-- Player Selection Dropdown -->
          <b-form-group label="Select Players">
            <b-form-select
                v-model="form.selectedPlayers"
                :options="playerOptions"
                multiple
                required
            ></b-form-select>
          </b-form-group>

          <b-button type="submit" variant="primary">{{ editing ? 'Save Changes' : 'Add Team' }}</b-button>
        </b-form>
      </b-modal>
    </b-container>
  </div>
</template>

<script>
import { mapActions, mapGetters } from 'vuex';

export default {
  data() {
    return {
      showModal: false,
      editing: false,
      form: {
        team_id: null,
        team_name: '',
        selectedPlayers: []  // Array to hold selected player IDs
      },
      filter: '',
      playerOptions: [], // Options for the player selection dropdown
      loading: false,
      error: null,
      currentPage: 1,
      perPage: 10,
      fields: [
        { key: 'team_name', label: 'Team Name', sortable: true },
        { key: 'player_count', label: 'Number of Players', sortable: false },
        { key: 'actions', label: 'Actions' },
      ],
      teamsTableKey: 0, // Key to refresh table view
    };
  },
  computed: {
    ...mapGetters(['allTeams', 'allPlayers']),
    filteredTeams() {
      if (!this.filter) return this.allTeams;
      const searchTerm = this.filter.toLowerCase();
      return this.allTeams.filter((team) =>
          team.team_name.toLowerCase().includes(searchTerm)
      );
    },
    isLoading() {
      return this.loading;
    },
  },
  methods: {
    ...mapActions(['fetchTeams', 'fetchPlayers', 'createTeam', 'updateTeam', 'deleteTeam']),

    // Load players and populate playerOptions for the dropdown
    fetchPlayers() {
      this.$store.dispatch('fetchPlayers').then(() => {
        this.playerOptions = this.allPlayers
            .filter(player => player.player_account_type === 'player') // Filter for players only
            .map(player => ({
              value: player.player_id,
              text: `${player.player_name} ${player.player_lastname}`
            }));
      });
    },

    openAddModal() {
      this.clearForm();
      this.showModal = true;
    },

    editTeam(team) {
      this.form = {
        team_id: team.team_id,
        team_name: team.team_name,
        selectedPlayers: team.players ? team.players.map(player => player.player_id) : []
      };
      this.editing = true;
      this.showModal = true;
    },

    confirmDeleteTeam(team_id) {
      if (confirm('Are you sure you want to delete this team?')) {
        this.deleteTeam(team_id)
            .then(this.refreshTable)
            .catch(err => {
              this.error = "Error deleting team.";
              console.error("Delete error:", err);
            });
      }
    },

    submitForm() {
      const { team_name, selectedPlayers, team_id } = this.form;

      if (!team_name) {
        this.error = "Team name is required.";
        return;
      }

      const action = this.editing ? this.updateTeam : this.createTeam;

      const payload = this.editing
          ? { teamId: team_id, teamData: { team_name, player_ids: selectedPlayers } }
          : { team_name, player_ids: selectedPlayers };

      action(payload)
          .then(() => {
            this.closeModal();
            this.fetchTeams();
          })
          .catch(err => {
            this.error = "Error saving team.";
            console.error("Save error:", err);
          });
    },

    closeModal() {
      this.showModal = false;
      this.error = null;
    },

    clearForm() {
      this.form = {
        team_id: null,
        team_name: '',
        selectedPlayers: []
      };
      this.editing = false;
      this.error = null;
    },

    clearFilter() {
      this.filter = '';
    },

    refreshTable() {
      // Update key to force refresh of table
      this.teamsTableKey += 1;
      this.fetchTeams(); // Fetch latest data after each operation
    },

    fetchTeams() {
      this.loading = true;
      this.error = null;

      // Fetch teams with loading and error handling
      this.$store.dispatch('fetchTeams')
          .then(() => {
            this.loading = false;
          })
          .catch((error) => {
            this.error = "Failed to load teams.";
            console.error("Fetch teams error:", error);
            this.loading = false;
          });
    }
  },

  mounted() {
    this.fetchTeams();
    this.fetchPlayers(); // Load players when component mounts
  }
};
</script>

<style scoped>
.admin-teams {
  color: var(--navyblue);
}

.magical-brush {
  font-family: 'MagicalBrush', cursive;
}

.magical-brush-button {
  font-family: 'MagicalBrush', cursive;
}
</style>
