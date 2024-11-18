<template>
    <div class="player-profile">
        <b-container class="mt-5 pt-5">
            <h2 class="text-center mb-4">Player Profile</h2>
            <!-- Loading Indicator -->
            <div v-if="isLoading" class="text-center my-4">
                <b-spinner label="Loading..."></b-spinner>
            </div>

            <!-- Error Message -->
            <b-alert v-if="error" variant="danger" dismissible aria-live="assertive" class="my-4">
                {{ error }}
            </b-alert>

            <!-- Player Info -->
            <div class="card" v-if="!isLoading && !error && player">
                <b-card>
                    <b-card-body>
                        <h4>{{ player.player_name }} {{ player.player_lastname }}</h4>
                        <p><strong>Nickname:</strong> {{ player.player_nickname }}</p>
                        <p><strong>Email:</strong> {{ player.player_email }}</p>
                        <p><strong>Account Type:</strong> {{ player.player_account_type || 'N/A' }}</p>
                        <p><strong>Team:</strong> {{ player.team ? player.team : 'No Team' }}</p>
                        <p><strong>Registration Date:</strong> {{ formatDate(player.registrationDate) }}</p>
                    </b-card-body>
                </b-card>
            </div>
        </b-container>
    </div>
</template>

<script>
    import { mapGetters } from 'vuex';
    import dayjs from 'dayjs';

    export default {
        name: 'PlayerProfile',
        props: {
            playerId: {
                type: Number,
                required: true,
            },
        },
        computed: {
            ...mapGetters(['playerById']),
            player() {
                return this.$store.getters.playerById;
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
                loading: false,
                fetchError: null,
            };
        },
        mounted() {
            this.fetchPlayerData();
        },
        methods: {
            fetchPlayerData() {
                this.loading = true;
                this.fetchError = null;
                this.$store.dispatch('fetchPlayerById', this.playerId)
                    .catch((error) => {
                        this.fetchError = 'Failed to load player data.';
                        console.error('Error fetching player data:', error);
                    })
                    .finally(() => {
                        this.loading = false;
                    });
            },
            formatDate(date) {
                return dayjs(date).format('MMMM D, YYYY');
            },
        },
    };
</script>

<style scoped>
.player-profile {
    color: var(--navyblue);
}
</style>
