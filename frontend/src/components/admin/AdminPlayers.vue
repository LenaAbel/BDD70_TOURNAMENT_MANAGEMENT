<template>
  <div class="players-list">
    <b-container class="mt-5 pt-5">
      <h2 class="text-center mb-4">Manage Players</h2>

      <!-- Add New Player Button -->
      <div class="text-right mb-3">
        <b-button variant="success" @click="openAddModal">
          <b-icon icon="plus-circle"></b-icon> Add Player
        </b-button>
      </div>

      <!-- Filter Controls -->
      <b-input-group class="mb-3">
        <b-form-input v-model="filter" placeholder="Search Players" aria-label="Search Players"></b-form-input>
        <b-input-group-append>
          <b-button variant="outline-secondary" @click="clearFilter">
            <b-icon icon="x-circle"></b-icon>
          </b-button>
        </b-input-group-append>
      </b-input-group>

      <!-- Players Table with Edit/Delete Actions -->
      <b-table :items="paginatedPlayers" :fields="fields" striped hover responsive aria-label="Players Table">
        <template #cell(actions)="data">
          <b-button size="sm" variant="warning" style="margin: 10px" @click="editPlayer(data.item)">
            <b-icon icon="pencil-square"></b-icon> Edit
          </b-button>
          <b-button size="sm" variant="danger" @click="confirmDeletePlayer(data.item.player_id)">
            <b-icon icon="trash"></b-icon> Delete
          </b-button>
        </template>
      </b-table>

      <!-- Pagination Controls -->
      <b-pagination v-model="currentPage" :total-rows="filteredPlayers.length" :per-page="perPage" align="center"></b-pagination>

      <!-- Add/Edit Player Modal -->
      <b-modal v-model="showModal" :title="editing ? 'Edit Player' : 'Add Player'" @hide="clearForm" hide-footer>
        <b-form @submit.prevent="submitForm">
          <b-form-group label="Email">
            <b-form-input
                type="email"
                v-model="form.email"
                required
                placeholder="Enter a valid email address"
            ></b-form-input>
          </b-form-group>
          <b-form-group label="Password">
            <b-input-group>
              <b-form-input
                  :type="passwordFieldType"
                  v-model="form.password"
                  :placeholder="editing ? 'Leave blank to keep current password' : 'Enter a password'"
              ></b-form-input>
              <b-input-group-append>
                <b-button @click="togglePasswordVisibility" variant="outline-secondary">
                  <b-icon :icon="passwordFieldType === 'password' ? 'eye' : 'eye-slash'"></b-icon>
                </b-button>
              </b-input-group-append>
            </b-input-group>
          </b-form-group>
          <b-form-group label="First Name"><b-form-input v-model="form.name" required></b-form-input></b-form-group>
          <b-form-group label="Last Name"><b-form-input v-model="form.lastname" required></b-form-input></b-form-group>
          <b-form-group label="Nickname"><b-form-input v-model="form.nickname"></b-form-input></b-form-group>
          <b-form-group label="Account Type">
            <b-form-select v-model="form.account_type" :options="accountTypeOptions" required></b-form-select>
          </b-form-group>
          <b-form-group label="Team">
            <b-form-select v-model="form.team_id" :options="teamOptions" placeholder="Select a team"></b-form-select>
          </b-form-group>
          <b-button type="submit" variant="primary">{{ editing ? 'Save Changes' : 'Add Player' }}</b-button>
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
      passwordFieldType: 'password',
      form: {
        player_id: null,
        email: '',
        name: '',
        lastname: '',
        nickname: '',
        account_type: 'player',
        password: '',
        team_id: null, // Add team_id to form
      },
      filter: '',
      currentPage: 1,
      perPage: 10,
      accountTypeOptions: [
        { value: 'player', text: 'Player' },
        { value: 'organizer', text: 'Organizer' },
        { value: 'admin', text: 'Admin' },
      ],
      teamOptions: [], // Options for teams dropdown
      fields: [
        { key: 'player_name', label: 'Name', sortable: true },
        { key: 'player_lastname', label: 'Last Name', sortable: true },
        { key: 'player_email', label: 'Email', sortable: true },
        { key: 'player_account_type', label: 'Account Type', sortable: true },
        { key: 'team_name', label: 'Team', sortable: true },
        { key: 'actions', label: 'Actions' },
      ]
    };
  },
  computed: {
    ...mapGetters(['allPlayers', 'allTeams', 'currentUser']),
    filteredPlayers() {
      return this.allPlayers
          .filter((player) => player.player_id !== this.currentUser.player_id)
          .filter((player) =>
              Object.values(player).some((val) => {
                if (val && typeof val === 'string') {
                  return val.toLowerCase().includes(this.filter.toLowerCase());
                }
                return false;
              })
          );
    },
    paginatedPlayers() {
      const start = (this.currentPage - 1) * this.perPage;
      return this.filteredPlayers.slice(start, start + this.perPage);
    },
  },
  methods: {
    ...mapActions(['fetchPlayers', 'fetchTeams', 'createPlayer', 'updatePlayer', 'deletePlayer']),
    openAddModal() {
      this.clearForm();
      this.showModal = true;
    },
    editPlayer(player) {
      this.form = {
        player_id: player.player_id,
        email: player.player_email,
        name: player.player_name,
        lastname: player.player_lastname,
        nickname: player.player_nickname,
        account_type: player.player_account_type,
        password: '',
        team_id: player.team_id, // Set the team_id when editing
      };
      this.editing = true;
      this.showModal = true;
    },
    confirmDeletePlayer(player_id) {
      if (confirm('Are you sure you want to delete this player?')) {
        this.deletePlayer(player_id).then(this.fetchPlayers);
      }
    },
    submitForm() {
      const playerData = { ...this.form };
      if (!playerData.password) delete playerData.password; // Only send password if provided

      if (this.editing) {
        this.updatePlayer({ playerId: this.form.player_id, playerData }).then(this.closeModal);
      } else {
        this.createPlayer(playerData).then(this.closeModal);
      }
    },
    closeModal() {
      this.showModal = false;
      this.fetchPlayers();
    },
    clearForm() {
      this.form = {
        player_id: null,
        email: '',
        name: '',
        lastname: '',
        nickname: '',
        account_type: 'player',
        password: '',
        team_id: null, // Reset team_id
      };
      this.editing = false;
    },
    clearFilter() {
      this.filter = '';
    },
    togglePasswordVisibility() {
      this.passwordFieldType = this.passwordFieldType === 'password' ? 'text' : 'password';
    },
    fetchTeamsList() {
      this.fetchTeams().then(() => {
        this.teamOptions = this.allTeams.map(team => ({
          value: team.team_id,
          text: team.team_name,
        }));
      });
    },
  },
  mounted() {
    this.fetchPlayers();
    this.fetchTeamsList();
  },
};
</script>
