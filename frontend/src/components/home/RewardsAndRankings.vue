<template>
  <div class="rewards-and-ranking">
    <b-container class="mt-5 pt-5">
      <h2 class="text-center mb-4">Rewards and Rankings</h2>

      <!-- Loading Indicator -->
      <div v-if="isLoading" class="text-center my-4">
        <b-spinner label="Loading..."></b-spinner>
      </div>

      <!-- Error Message -->
      <b-alert v-if="error" variant="danger" dismissible aria-live="assertive" class="my-4">
        {{ error }}
      </b-alert>

      <!-- All Rewards -->
      <div v-if="!isLoading && !error && rewards.length">
        <h3 class="text-center mt-4">All Rewards</h3>
        <b-table striped hover :items="rewards" :fields="rewardFields" class="mt-3">
          <template #cell(award_date)="data">
            {{ formatDate(data.value) }}
          </template>
        </b-table>
      </div>

      <!-- Player Rankings -->
      <div v-if="!isLoading && !error && playerRanking.length" class="mt-5">
        <h3 class="text-center">Player Rankings</h3>
        <b-table striped hover :items="playerRanking" :fields="rankingFields" class="mt-3">
          <template #cell(reward_count)="data">
            <b-badge variant="success">{{ data.value }}</b-badge>
          </template>
        </b-table>
      </div>

      <!-- Team Rankings -->
      <div v-if="!isLoading && !error && teamRanking.length" class="mt-5">
        <h3 class="text-center">Team Rankings</h3>
        <b-table striped hover :items="teamRanking" :fields="rankingFields" class="mt-3">
          <template #cell(reward_count)="data">
            <b-badge variant="info">{{ data.value }}</b-badge>
          </template>
        </b-table>
      </div>
    </b-container>
  </div>
</template>

<script>
import dayjs from "dayjs";

export default {
  name: "RewardsAndRanking",
  data() {
    return {
      rewards: [],
      playerRanking: [],
      teamRanking: [],
      isLoading: false,
      error: null,
      rewardFields: [
        { key: "reward_name", label: "Reward Name" },
        { key: "reward_type", label: "Type" },
      ],
      rankingFields: [
        { key: "name", label: "Name" },
        { key: "reward_count", label: "Reward Count" },
      ],
    };
  },
  mounted() {
    this.fetchData();
  },
  methods: {
    async fetchData() {
      this.isLoading = true;
      this.error = null;

      try {
        const [rewardsResponse, assignmentsResponse] = await Promise.all([
          this.$store.dispatch("fetchRewards"),
          this.$store.dispatch("fetchRewardAssignments"),
        ]);

        const rewards = this.$store.state.rewards;
        const assignments = this.$store.state.rewardAssignments;

        console.log("Rewards Response:", rewardsResponse);
        console.log("Assignments Response:", assignmentsResponse);

        this.rewards = rewards;

        // Process Player Rankings
        const playerRewards = assignments.filter((a) => a.player_nickname);
        this.playerRanking = this.computeRanking(playerRewards, "player_nickname");

        // Process Team Rankings
        const teamRewards = assignments.filter((a) => a.team_name);
        this.teamRanking = this.computeRanking(teamRewards, "team_name");
      } catch (error) {
        this.error = error.message || "Failed to fetch data.";
      } finally {
        this.isLoading = false;
      }
    },
    computeRanking(assignments, nameKey) {
      const ranking = {};

      assignments.forEach((assignment) => {
        const name = assignment[nameKey] || `Unknown ${nameKey}`;
        if (!ranking[name]) {
          ranking[name] = { name, reward_count: 0 };
        }
        ranking[name].reward_count++;
      });

      return Object.values(ranking).sort((a, b) => b.reward_count - a.reward_count);
    },
    formatDate(date) {
      return dayjs(date).format("MMMM D, YYYY");
    },
  },
};
</script>

<style scoped>
.rewards-and-ranking {
  color: var(--navyblue);
}
</style>
