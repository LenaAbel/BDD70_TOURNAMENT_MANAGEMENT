import Vue from 'vue';
import Vuex from 'vuex';
import axios from '../axios';

Vue.use(Vuex);

export default new Vuex.Store({
    state: {
        tournaments: [],
        players: [],
        player: {},
        teams: [],
        activities: [],
        organizers: [],
        playerStats: [],
        playerRanking: [],
        formatTypes: [],
        tournamentTypes: [],
        user: (() => {
            try {
                return JSON.parse(localStorage.getItem('user')) || null;
            } catch {
                return null; // Handle invalid JSON or undefined
            }
        })(),
        token: localStorage.getItem('token') || null, // Fallback to `null` if `token` is not set
        rewards: [],
        rewardAssignments: [],
    },
    mutations: {
        SET_TOURNAMENTS(state, tournaments) {
            state.tournaments = tournaments;
        },
        SET_PLAYERS(state, players) {
            state.players = players;
        },
        SET_PLAYER(state, player) {
            // Exclude the password from the player data
            const playerData = { ...player };
            delete playerData.player_password;
            state.player = playerData;
        },

        SET_PLAYER_STATS(state, playerStats) {
            state.playerStats = playerStats;
        },
        SET_PLAYER_RANKING(state, playerRanking) {
            state.playerRanking = playerRanking;
        },
        SET_TEAMS(state, teams) {
            state.teams = teams;
        },
        SET_ACTIVITIES(state, activities) {
            state.activities = activities;
        },
        SET_ORGANIZERS(state, organizers) {
            state.organizers = organizers;
        },
        SET_USER(state, user) {
            state.user = user;
            localStorage.setItem('user', JSON.stringify(user));
        },
        SET_FORMAT_TYPES(state, formatTypes) {
            state.formatTypes = formatTypes;
        },
        SET_TOURNAMENT_TYPES(state, tournamentTypes) {
            state.tournamentTypes = tournamentTypes;
        },
        SET_TOKEN(state, token) {
            state.token = token;
            localStorage.setItem("token", token);

            // Set the default Authorization header for Axios
            axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
        },
        CLEAR_USER(state) {
            state.user = null;
            state.token = null;
            localStorage.removeItem('user');
            localStorage.removeItem('token');
        },
        UPDATE_TEAM(state, updatedTeam) {
            const index = state.teams.findIndex(team => team.team_id === updatedTeam.team_id);
            if (index !== -1) {
                Vue.set(state.teams, index, updatedTeam);
            }
        },
        SET_REWARDS(state, rewards) { // Added mutation for setting rewards
            state.rewards = rewards;
        },
        SET_REWARD_ASSIGNMENTS(state, rewardAssignments) { // Added mutation for setting reward assignments
            state.rewardAssignments = rewardAssignments;
        },
    },
    actions: {
        async fetchTournaments({ commit }) {
            try {
                const response = await axios.get("/tournament/");
                commit("SET_TOURNAMENTS", response.data);
                return response.data;
            } catch (error) {
                console.error("Error fetching tournaments:", error);
                throw error;
            }
        },
        async fetchPlayers({ commit }) {
            try {
                const response = await axios.get('/players');
                commit('SET_PLAYERS', response.data);
                return response.data;
            } catch (error) {
                console.error('Error fetching players:', error);
                throw error;
            }
        },
        fetchPlayerById({ commit }, playerId) {
            return axios
                .get(`/players/${playerId}`)
                .then((response) => {
                    commit("SET_PLAYER", response.data);
                    return response.data;
                })
                .catch((error) => {
                    console.error("Error fetching player:", error);
                    throw error;
                });
        },
        fetchPlayerStats(_, playerId) {
            return axios
                .get(`/playerStats/${playerId}`)
                .then((response) => response.data)
                .catch((err) => {
                    console.error("Error fetching player stats:", err);
                    throw err;
                });
        },
        async fetchPlayerRanking(_, playerId) {
            try {
                const response = await axios.get(`/ranking/player/${playerId}`);
                return response.data;
            } catch (error) {
                console.error('Error fetching player ranking:', error);
                throw error;
            }
        },
        createPlayer({ dispatch }, playerData) {
            return axios.post('/players', playerData).then(() => {
                return dispatch('fetchPlayers');
            });
        },
        updatePlayer(_, { playerId, playerData }) {
            return axios
                .put(`/players/${playerId}`, playerData)
                .then((response) => response.data)
                .catch((err) => {
                    console.error("Error in Vuex updatePlayer action:", err);
                    throw err;
                });
        },
        deletePlayer({ dispatch }, playerId) {
            return axios.delete(`/players/${playerId}`).then(() => {
                return dispatch('fetchPlayers');
            });
        },
        fetchOrganizers({ commit }) {
            return axios.get('/players?account_type=organizer')
                .then(response => {
                    commit('SET_ORGANIZERS', response.data);
                })
                .catch(error => {
                    console.error('Error fetching organizers:', error);
                    throw error;
                });
        },
        fetchTeams({ commit }) {
            return axios.get('/team')
                .then(response => {
                    commit('SET_TEAMS', response.data);
                    return response.data;
                })
                .catch(error => {
                    console.error('Error fetching teams:', error);
                    throw error;
                });
        },
        async fetchTeamStats(_, teamId) {
            try {
                const response = await axios.get(`/teamStats/team/${teamId}`);
                return response.data; // Ensure it returns the array directly
            } catch (error) {
                console.error('Error fetching team stats:', error);
                throw error;
            }
        },
        createTeam({ dispatch }, { team_name, player_ids }) {
            return axios.post('/team', { team_name, player_ids })
                .then(() => dispatch('fetchTeams'))
                .catch(error => {
                    console.error('Error creating team:', error);
                    throw error;
                });
        },
        updateTeam({ dispatch }, { teamId, teamData }) {

            if (!teamId || !teamData.team_name) {
                console.error("Missing teamId or team_name for update");
                return Promise.reject(new Error("Team ID and team name are required"));
            }

            return axios.put(`/team/${teamId}`, { team_name: teamData.team_name })
                .then(() => {
                    if (teamData.player_ids && teamData.player_ids.length > 0) {
                        return dispatch('assignPlayersToTeam', {
                            teamId,
                            playerIds: teamData.player_ids
                        });
                    }
                })
                .then(() => dispatch('fetchTeams'))
                .catch(error => {
                    console.error('Error updating team:', error);
                    throw error;
                });
        },
        deleteTeam({ dispatch }, teamId) {
            return axios.delete(`/team/${teamId}`)
                .then(() => dispatch('fetchTeams'))
                .catch(error => {
                    console.error('Error deleting team:', error);
                    throw error;
                });
        },
        assignPlayersToTeam({ dispatch }, { teamId, playerIds }) {
            return axios.put(`/team/${teamId}/players`, { player_ids: playerIds })
                .then(() => dispatch('fetchTeams'))
                .catch(error => {
                    console.error('Error assigning players to team:', error);
                    throw error;
                });
        },
        fetchRules({ commit }) {
            return axios.get('rules/')
                .then(response => {
                    commit('SET_RULES', response.data);
                })
                .catch(error => {
                    console.error('Error fetching rules:', error);
                    throw error;
                });

        },
        /**
         * Fetch all activities from the backend
         */
        async fetchActivities({ commit }) {
            try {
                const response = await axios.get('/activity');
                commit('SET_ACTIVITIES', response.data);
            } catch (error) {
                console.error('Error fetching activities:', error);
            }
        },
        /**
         * Fetch a specific activity by ID (optional)
         */
        fetchActivityById({ commit }, playerId) {
            return axios.get(`activity/${playerId}`)
                .then((response) => {
                    commit('SET_ACTIVITIES', [response.data]);  // You might want to replace or append depending on structure
                })
                .catch((error) => {
                    console.error('Error fetching player:', error);
                    throw error;
                });
        },
        loginUser({ commit }, credentials) {
            return axios
                .post("/players/login", credentials)
                .then((response) => {
                    const { user, token } = response.data;

                    if (!user || !token) {
                        throw new Error("Invalid login response: Missing user or token");
                    }
                    // Commit user and token to the Vuex store
                    commit("SET_USER", user);
                    commit("SET_TOKEN", token);

                    return user; // Return user for further use in the frontend
                })
                .catch((error) => {
                    console.error("Error logging in:", error.response?.data || error.message);
                    // Throw the error to be caught in the component
                    throw error;
                });
        },
        logout({ commit }) {
            commit('CLEAR_USER');
            window.location.href = '/login'; // Redirect to login page
        },
        registerPlayer({ commit }, form) {
            return axios
                .post('/players/register', form)
                .then((response) => {
                    const { user, token } = response.data;

                    // Commit user and token to the Vuex store
                    commit('SET_USER', user);
                    commit('SET_TOKEN', token);

                    return response.data;
                })
                .catch((error) => {
                    console.error('Error during registration:', error);
                    throw error;
                });
        },
        createTournament({ dispatch }, tournamentData) {
            return axios.post('/tournament', tournamentData)
                .then(() => dispatch('fetchTournaments'))
                .catch(error => {
                    console.error('Error creating tournament:', error);
                    throw error;
                });
        },
        updateTournament({ dispatch }, { tournamentId, tournamentData }) {
            return axios.put(`/tournament/${tournamentId}`, tournamentData)
                .then(() => dispatch('fetchTournaments'))
                .catch(error => {
                    console.error('Error updating tournament:', error);
                    throw error;
                });
        },
        deleteTournament({ dispatch }, tournamentId) {
            return axios.delete(`/tournament/${tournamentId}`)
                .then(() => dispatch('fetchTournaments'))
                .catch(error => {
                    console.error('Error deleting tournament:', error);
                    throw error;
                });
        },
        unregisterPlayerFromTournament(_, { player_id, tournament_id }) {
            return axios
                .delete(`/register/${player_id}/${tournament_id}`)
                .then((response) => {
                    return response.data;
                })
                .catch((err) => {
                    console.error("Error unregistering player:", err);
                    throw err;
                });
        },
        fetchRegisteredTournaments(_, player_id) {
            return axios
                .get(`/register?player_id=${player_id}`)
                .then((response) => response.data)
                .catch((err) => {
                    console.error("Error fetching registered tournaments:", err);
                    throw err;
                });
        },
        fetchRewards({ commit }) {
            return axios.get('/rewards')
                .then(response => {
                    commit('SET_REWARDS', response.data);
                })
                .catch(error => {
                    console.error('Error fetching rewards:', error);
                    throw error;
                });
        },
        fetchRewardAssignments({ commit }) {
            return axios.get('/rewards/assignments')
                .then(response => {

                    commit('SET_REWARD_ASSIGNMENTS', response.data);
                })
                .catch(error => {
                    console.error('Error fetching reward assignments:', error);
                    throw error;
                });
        },

        registerPlayerToTournament(_, { player_id, tournament_id }) {
            return axios
                .post("/register/player", { player_id, tournament_id })
                .then((response) => {
                    return response.data;
                })
                .catch((err) => {
                    console.error("Error registering player:", err);
                    throw err; // Re-throw error to handle it in the component
                });
        },
        fetchFormatTypes({ commit }) {
            return axios.get('/tournament/format_types')
                .then(response => {
                    commit('SET_FORMAT_TYPES', response.data);
                })
                .catch(error => {
                    console.error('Error fetching format types:', error);
                    throw error;
                });
        },
        fetchTournamentTypes({ commit }) {
            return axios.get('/tournament/tournament_types')
                .then(response => {
                    commit('SET_TOURNAMENT_TYPES', response.data);
                })
                .catch(error => {
                    console.error('Error fetching tournament types:', error);
                    throw error;
                });
        },
    },
    getters: {
        allTournaments: (state) => state.tournaments,
        allPlayers: (state) => state.players,
        playerById: (state) => state.player,
        allTeams: (state) => state.teams,
        allActivities: (state) => state.activities,
        allOrganizers: (state) => state.organizers,
        isLoggedIn: (state) => !!state.user,
        currentUser: (state) => state.user,
        userRole: (state) => (state.user ? state.user.account_type : null),
        totalPlayers: (state) => state.players.length,
        totalTournaments: (state) => state.tournaments.length,
        totalTeams: (state) => state.teams.length,
        totalActivities: (state) => state.activities.length,
    },
});
