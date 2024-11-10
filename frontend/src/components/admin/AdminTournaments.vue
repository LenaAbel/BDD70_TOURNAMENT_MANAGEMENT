<!-- src/components/admin/AdminTournaments.vue -->
<template>
  <div class="admin-tournaments">
    <b-container class="mt-5 pt-5">
      <h2 class="text-center mb-4">Manage Tournaments</h2>
      <!-- Add forms and controls to create, edit, delete tournaments -->
      <b-button variant="success" @click="showCreateModal">Create Tournament</b-button>

      <!-- Tournaments Table -->
      <b-table
          :items="tournaments"
          :fields="fields"
          striped
          hover
          responsive
          class="mt-4">
        <template #cell(actions)="data">
          <b-button size="sm" variant="primary" @click="editTournament(data.item)">Edit</b-button>
          <b-button size="sm" variant="danger" @click="deleteTournament(data.item.tournament_id)">Delete</b-button>
        </template>
      </b-table>

      <!-- Modals for creating and editing tournaments -->
      <!-- ... Modals implementation ... -->
    </b-container>
  </div>
</template>

<script>
import { mapActions, mapGetters } from 'vuex';

export default {
  name: 'AdminTournaments',
  data() {
    return {
      fields: [
        { key: 'tournament_name', label: 'Name' },
        { key: 'activity_name', label: 'Game' },
        { key: 'tournament_start_time', label: 'Start Time' },
        { key: 'actions', label: 'Actions' },
      ],
      // ... other data properties ...
    };
  },
  computed: {
    ...mapGetters(['allTournaments']),
    tournaments() {
      return this.allTournaments;
    },
  },
  methods: {
    ...mapActions(['fetchTournaments']),
    showCreateModal() {
      // Show modal to create a new tournament

    },
    editTournament(tournament) {
      // Show modal to edit the selected tournament
      console.log('Edit tournament:', tournament);

    },
    deleteTournament(tournamentId) {
      // Send request to delete the tournament
      // Update the list after deletion
      console.log('Delete tournament:', tournamentId);
    },
  },
  mounted() {
    this.fetchTournaments();
  },
};
</script>

<style scoped>
/* ... styles ... */
</style>
