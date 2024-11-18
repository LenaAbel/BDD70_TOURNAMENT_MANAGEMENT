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
        <b-table
            striped
            hover
            :items="paginatedRewards"
            :fields="rewardFields"
            class="mt-3"
        >
          <template #cell(award_date)="data">
            {{ formatDate(data.value) }}
          </template>
        </b-table>
        <!-- Pagination for Rewards -->
        <b-pagination
            v-if="rewards.length > rewardsPerPage"
            v-model="rewardsCurrentPage"
            :total-rows="rewards.length"
            :per-page="rewardsPerPage"
            align="center"
            class="my-4"
        ></b-pagination>
      </div>

      <!-- Player Rankings -->
      <div v-if="!isLoading && !error && playerRanking.length" class="mt-5">
        <h3 class="text-center">Player Rankings</h3>
        <b-table
            striped
            hover
            :items="paginatedPlayerRanking"
            :fields="rankingFields"
            class="mt-3"
        >
          <template #cell(reward_count)="data">
            <b-badge variant="success">{{ data.value }}</b-badge>
          </template>
        </b-table>
        <!-- Pagination for Player Rankings -->
        <b-pagination
            v-if="playerRanking.length > playerRankingPerPage"
            v-model="playerRankingCurrentPage"
            :total-rows="playerRanking.length"
            :per-page="playerRankingPerPage"
            align="center"
            class="my-4"
        ></b-pagination>
      </div>

      <!-- Team Rankings -->
      <div v-if="!isLoading && !error && teamRanking.length" class="mt-5">
        <h3 class="text-center">Team Rankings</h3>
        <b-table
            striped
            hover
            :items="paginatedTeamRanking"
            :fields="rankingFields"
            class="mt-3"
        >
          <template #cell(reward_count)="data">
            <b-badge variant="info">{{ data.value }}</b-badge>
          </template>
        </b-table>
        <!-- Pagination for Team Rankings -->
        <b-pagination
            v-if="teamRanking.length > teamRankingPerPage"
            v-model="teamRankingCurrentPage"
            :total-rows="teamRanking.length"
            :per-page="teamRankingPerPage"
            align="center"
            class="my-4"
        ></b-pagination>
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
      // Pagination data properties
      rewardsPerPage: 10,
      rewardsCurrentPage: 1,
      playerRankingPerPage: 10,
      playerRankingCurrentPage: 1,
      teamRankingPerPage: 10,
      teamRankingCurrentPage: 1,
    };
  },
  computed: {
    // Computed properties for paginated data
    paginatedRewards() {
      const start = (this.rewardsCurrentPage - 1) * this.rewardsPerPage;
      const end = this.rewardsCurrentPage * this.rewardsPerPage;
      return this.rewards.slice(start, end);
    },
    paginatedPlayerRanking() {
      const start = (this.playerRankingCurrentPage - 1) * this.playerRankingPerPage;
      const end = this.playerRankingCurrentPage * this.playerRankingPerPage;
      return this.playerRanking.slice(start, end);
    },
    paginatedTeamRanking() {
      const start = (this.teamRankingCurrentPage - 1) * this.teamRankingPerPage;
      const end = this.teamRankingCurrentPage * this.teamRankingPerPage;
      return this.teamRanking.slice(start, end);
    },
  },
  mounted() {
    this.fetchData();
  },
  methods: {
    async fetchData() {
      this.isLoading = true;
      this.error = null;

      try {
        await Promise.all([
          this.$store.dispatch("fetchRewards"),
          this.$store.dispatch("fetchRewardAssignments"),
        ]);

        const rewards = this.$store.state.rewards;
        const assignments = this.$store.state.rewardAssignments;

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
