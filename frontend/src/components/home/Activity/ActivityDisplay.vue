<template>
    <div class="activity-profile">
        <b-container class="mt-5 pt-5">
            <h2 class="text-center mb-4">Activity Profile</h2>

            <!-- Loading Indicator -->
            <div v-if="isLoading" class="text-center my-4">
                <b-spinner label="Loading..."></b-spinner>
            </div>

            <!-- Error Message -->
            <b-alert v-if="error" variant="danger" dismissible aria-live="assertive" class="my-4">
                {{ error }}
            </b-alert>

            <!-- Activity Info -->
            <div v-if="!isLoading && !error && activity">
                <b-card>
                    <b-card-body>
                        <h4>{{ activity.activity_name }}</h4>
                        <p><strong>Description:</strong> {{ activity.activity_description }}</p>
                        <p><strong>Category:</strong> {{ activity.activity_category }}</p>
                        <p><strong>Type:</strong> {{ activity.activity_type }}</p>
                        <p><strong>Number of Players:</strong> {{ activity.activity_number_of_players }}</p>
                        <p><strong>Registration Date:</strong> {{ formatDate(activity.registrationDate) }}</p>
                    </b-card-body>
                </b-card>
            </div>
        </b-container>
    </div>
</template>

<script>
    import {
        mapGetters
    } from 'vuex';
    import dayjs from 'dayjs';

    export default {
        name: 'ActivityDisplay',
        computed: {
            ...mapGetters(['allActivities']),
            activity() {
                // Get the activity by ID (passed via the route parameter)
                return this.allActivities.find((activity) => activity.activity_id === parseInt(this.activityId));
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
                activityId: this.$route.params.id, // Get the activity ID from route params
                loading: false,
                fetchError: null,
            };
        },
        mounted() {
            this.fetchActivityData();
        },
        methods: {
            fetchActivityData() {
                this.loading = true;
                this.fetchError = null;
                this.$store.dispatch('fetchActivities') // Dispatch the action to fetch all activities
                    .catch((error) => {
                        this.fetchError = 'Failed to load activity data.';
                        console.error('Error fetching activity data:', error);
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
    .activity-profile {
        padding: 20px;
    }
</style>