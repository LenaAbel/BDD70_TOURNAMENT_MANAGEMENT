<!--PlayerProfile.vue-->
<template>
  <div class="player-profile">
    <b-container class="mt-5 pt-5">
      <h2 class="text-center mb-4">Player Profile</h2>

      <!-- Error Message -->
      <b-alert v-if="error" variant="danger" dismissible class="my-4">
        {{ error }}
      </b-alert>

      <!-- Loading Spinner -->
      <div v-if="loading" class="text-center my-4">
        <b-spinner label="Loading..."></b-spinner>
      </div>

      <!-- Player Info -->
      <b-card v-if="!loading && !error && player" class="mb-4">
        <h4>{{ player.player_name }} {{ player.player_lastname }}</h4>
        <p><strong>Name:</strong> {{ player.player_name || "N/A" }}</p>
        <p><strong>Last Name:</strong> {{ player.player_lastname || "N/A" }}</p>
        <p><strong>Nickname:</strong> {{ player.player_nickname || "N/A" }}</p>
        <p><strong>Email:</strong> {{ player.player_email || "N/A" }}</p>
        <p><strong>Registration Date:</strong> {{ formatDate(player.player_registrationDate) || "N/A" }}</p>
        <p><strong>Account Type:</strong> {{ player.player_account_type || "N/A" }}</p>
        <p>
          <strong>Team:</strong>
          <span v-if="player.team_id">Team {{ player.team_id }}</span>
          <span v-else>No Team</span>
        </p>
      </b-card>

      <!-- Player Actions -->
      <b-card v-if="!loading && !error && player" class="actions-card">
        <b-button variant="primary" class="mr-2" @click="showEditModal">
          Edit Profile
        </b-button>
      </b-card>

      <!-- Edit Profile Modal -->
      <b-modal
          id="edit-profile-modal"
          title="Edit Profile"
          @hide="resetForm"
          hide-footer
      >
        <b-form v-if="editablePlayer" @submit.prevent="saveChanges">
          <b-form-group label="First Name" label-for="player-name">
            <b-form-input
                id="player-name"
                v-model="editablePlayer.player_name"
                required
            ></b-form-input>
          </b-form-group>

          <b-form-group label="Last Name" label-for="player-lastname">
            <b-form-input
                id="player-lastname"
                v-model="editablePlayer.player_lastname"
                required
            ></b-form-input>
          </b-form-group>

          <b-form-group label="Nickname" label-for="player-nickname">
            <b-form-input
                id="player-nickname"
                v-model="editablePlayer.player_nickname"
                required
            ></b-form-input>
          </b-form-group>

          <b-form-group label="Email" label-for="player-email">
            <b-form-input
                id="player-email"
                type="email"
                v-model="editablePlayer.player_email"
                required
            ></b-form-input>
          </b-form-group>

          <b-form-group label="Password" label-for="new-password">
            <b-input-group>
              <b-form-input
                  id="new-password"
                  type="password"
                  v-model="passwordChange.newPassword"
                  placeholder="Leave blank to keep current password"
              ></b-form-input>
            </b-input-group>
          </b-form-group>

          <b-button type="submit" variant="success" class="mt-3">
            Save Changes
          </b-button>
        </b-form>
      </b-modal>
    </b-container>
  </div>
</template>

<script>
import dayjs from "dayjs";

export default {
  name: "PlayerProfile",
  data() {
    return {
      player: null, // Player data
      editablePlayer: null, // Editable copy of player data
      passwordChange: {
        newPassword: "", // New password, if provided
      },
      loading: true,
      error: null,
    };
  },
  methods: {
    // Fetch player data
    fetchPlayerData() {
      const playerId = this.$store.getters.currentUser?.player_id;
      if (!playerId) {
        this.error = "Player ID is missing. Please log in again.";
        this.loading = false;
        return;
      }
      this.$store
          .dispatch("fetchPlayerById", playerId)
          .then((data) => {
            console.log("Player data fetched:", data); // Debug log
            this.player = data;
            this.loading = false;
          })
          .catch((err) => {
            console.error("Error fetching player data:", err);
            this.error = "Failed to load player data.";
            this.loading = false;
          });
    },

    // Show edit modal
    showEditModal() {
      if (this.player) {
        this.editablePlayer = { ...this.player }; // Clone player data
        this.passwordChange = { newPassword: "" }; // Reset password change field
        this.$bvModal.show("edit-profile-modal");
      }
    },

    // Save changes
    saveChanges() {
      if (!this.editablePlayer) return;

      const playerId = this.$store.getters.currentUser?.player_id;
      if (!playerId) {
        this.error = "Player ID is missing. Please log in again.";
        return;
      }

      // Prepare updated player data
      const updatedPlayerData = {
        email: this.editablePlayer.player_email,
        name: this.editablePlayer.player_name,
        lastname: this.editablePlayer.player_lastname,
        nickname: this.editablePlayer.player_nickname,
        password: this.passwordChange.newPassword || this.player.player_password,
        account_type: this.player.player_account_type,
        team_id: this.player.team_id,
      };

      console.log("Sending updated player data:", updatedPlayerData);

      this.$store
          .dispatch("updatePlayer", { playerId, playerData: updatedPlayerData })
          .then(() => {
            console.log("Player update succeeded");
            this.$bvToast.toast("Profile updated successfully!", {
              title: "Success",
              variant: "success",
              solid: true,
            });
            this.fetchPlayerData(); // Refresh player data
            this.$bvModal.hide("edit-profile-modal"); // Hide modal
          })
          .catch((err) => {
            console.error("Error updating player:", err);
            this.error = "Failed to update profile. Please try again.";
          });
    },

    // Reset form
    resetForm() {
      this.editablePlayer = null;
      this.passwordChange = { newPassword: "" };
    },

    // Format date
    formatDate(date) {
      return dayjs(date).format("MMMM D, YYYY");
    },
  },
  mounted() {
    this.fetchPlayerData();
  },
};
</script>

<style scoped>
.player-profile {
  color: var(--navyblue);
}

.actions-card {
  text-align: center;
}

.b-card {
  margin: 20px auto;
  padding: 15px;
}
</style>
