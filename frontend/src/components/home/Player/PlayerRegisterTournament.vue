<template>
  <div class="tournaments-list">
    <b-container class="mt-5 pt-5">
      <h2 class="text-center mb-4">Available Tournaments</h2>

      <!-- Filters -->
      <b-row class="mb-3">
        <b-col md="4">
          <b-form-group label="Search by Name">
            <b-form-input v-model="filters.name" placeholder="Enter tournament name"></b-form-input>
          </b-form-group>
        </b-col>
        <b-col md="4">
          <b-form-group label="Filter by Type">
            <b-form-select v-model="filters.type" :options="typeOptions" placeholder="Select type"></b-form-select>
          </b-form-group>
        </b-col>
        <b-col md="4">
          <b-form-group label="Start Date">
            <b-form-datepicker v-model="filters.startDate" placeholder="Select start date"></b-form-datepicker>
          </b-form-group>
        </b-col>
      </b-row>

      <!-- Loading Indicator -->
      <div v-if="loading" class="text-center my-4">
        <b-spinner label="Loading..."></b-spinner>
      </div>

      <!-- Error Message -->
      <b-alert v-if="error" variant="danger" dismissible class="my-4">
        {{ error }}
      </b-alert>

      <!-- No Tournaments Found -->
      <div v-if="!loading && !error && paginatedTournaments.length === 0" class="text-center my-4">
        <p>No tournaments available for registration.</p>
      </div>

      <!-- Tournaments Table -->
      <b-table
          v-if="!loading && !error && paginatedTournaments.length > 0"
          :items="paginatedTournaments"
          :fields="fields"
          striped
          hover
          responsive
          aria-label="Tournaments Table"
      >
        <!-- Format Date -->
        <template #cell(tournament_start_time)="data">
          {{ formatDate(data.item.tournament_start_time) }}
        </template>

        <!-- Actions -->
        <template #cell(actions)="data">
          <b-button
              v-if="isPlayerRegistered(data.item.tournament_id)"
              variant="danger"
              size="sm"
              @click="unregisterFromTournament(data.item.tournament_id)"
          >
            Unregister
          </b-button>
          <b-button
              v-else
              variant="primary"
              size="sm"
              @click="registerForTournament(data.item.tournament_id)"
          >
            Register
          </b-button>
        </template>
      </b-table>

      <!-- Pagination Controls -->
      <b-pagination
          v-if="!loading && !error && filteredTournaments.length > perPage"
          v-model="currentPage"
          :total-rows="filteredTournaments.length"
          :per-page="perPage"
          align="center"
          class="my-4 pagination"
      ></b-pagination>
    </b-container>
  </div>
</template>

<script>
import dayjs from "dayjs";
export default {
  data() {
    return {
      tournaments: [],
      fields: [
        { key: "tournament_name", label: "Name" },
        { key: "tournament_start_time", label: "Start Time" },
        { key: "tournament_type", label: "Type" },
        { key: "actions", label: "Actions" },
      ],
      currentPage: 1,
      perPage: 10,
      loading: false,
      error: null,
      registeredTournaments: [], // Track tournaments where the player is registered
      filters: {
        name: "",
        type: "",
        startDate: null,
      },
      typeOptions: [
        { value: null, text: "All Types" },
        { value: "solo", text: "Solo" },
        { value: "team", text: "Team" },
      ],
    };
  },
  computed: {
    filteredTournaments() {
      return this.tournaments.filter((tournament) => {
        const matchesName = this.filters.name
            ? tournament.tournament_name.toLowerCase().includes(this.filters.name.toLowerCase())
            : true;

        const matchesType = this.filters.type
            ? tournament.tournament_type === this.filters.type
            : true;

        const matchesStartDate = this.filters.startDate
            ? dayjs(tournament.tournament_start_time).isSame(this.filters.startDate, "day")
            : true;

        return matchesName && matchesType && matchesStartDate;
      });
    },
    paginatedTournaments() {
      const start = (this.currentPage - 1) * this.perPage;
      const end = this.currentPage * this.perPage;
      return this.filteredTournaments.slice(start, end);
    },
  },
  methods: {
    fetchTournaments() {
      this.loading = true;
      this.error = null;

      // Fetch all tournaments
      this.$store
          .dispatch("fetchTournaments")
          .then((tournaments) => {
            this.tournaments = tournaments;
          })
          .catch((err) => {
            this.error = "Failed to load tournaments.";
            console.error(err);
          })
          .finally(() => {
            this.loading = false;
          });

      // Fetch registered tournaments for the current player
      const playerId = this.$store.getters.currentUser.player_id;
      this.$store
          .dispatch("fetchRegisteredTournaments", playerId)
          .then((registered) => {
            this.registeredTournaments = registered
                .filter((reg) => reg.player_id === playerId)
                .map((reg) => reg.tournament_id);
          })
          .catch((err) => {
            console.error("Error fetching registered tournaments:", err);
          });
    },
    isPlayerRegistered(tournamentId) {
      return this.registeredTournaments.includes(tournamentId);
    },
    registerForTournament(tournamentId) {
      const playerId = this.$store.getters.currentUser.player_id;

      this.$store
          .dispatch("registerPlayerToTournament", { player_id: playerId, tournament_id: tournamentId })
          .then(() => {
            this.$bvToast.toast("Successfully registered for the tournament!", {
              title: "Success",
              variant: "success",
              solid: true,
            });
            // Update registeredTournaments
            if (!this.registeredTournaments.includes(tournamentId)) {
              this.registeredTournaments.push(tournamentId);
            }
          })
          .catch((err) => {
            console.error("Registration failed:", err);
            this.$bvToast.toast("Registration failed. Please try again.", {
              title: "Error",
              variant: "danger",
              solid: true,
            });
          });
    },

    unregisterFromTournament(tournamentId) {
      const playerId = this.$store.getters.currentUser.player_id;

      this.$store
          .dispatch("unregisterPlayerFromTournament", { player_id: playerId, tournament_id: tournamentId })
          .then(() => {
            this.$bvToast.toast("Successfully unregistered from the tournament!", {
              title: "Success",
              variant: "success",
              solid: true,
            });
            // Update registeredTournaments
            this.registeredTournaments = this.registeredTournaments.filter(
                (id) => id !== tournamentId
            );
          })
          .catch((err) => {
            console.error("Unregistration failed:", err);
            this.$bvToast.toast("Unregistration failed. Please try again.", {
              title: "Error",
              variant: "danger",
              solid: true,
            });
          });
    },
    formatDate(date) {
      return dayjs(date).format("MMMM D, YYYY");
    },
  },
  mounted() {
    this.fetchTournaments();
  },
};

</script>

<style scoped>
.tournaments-list {
  color: var(--navyblue);
}

.b-table th,
.b-table td {
  text-align: center;
}

.pagination .page-link {
  cursor: pointer;
}
.filters-row {
  margin-bottom: 20px;
}

</style>
