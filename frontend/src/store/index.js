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
        user: JSON.parse(localStorage.getItem('user')) || null,
    },
    mutations: {
        SET_TOURNAMENTS(state, tournaments) {
            state.tournaments = tournaments;
        },
        SET_PLAYERS(state, players) {
            state.players = players;
        },
        SET_PLAYER(state, player) {
            state.player = player;
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
        SET_USER(state, user) {
            state.user = user;
            localStorage.setItem('user', JSON.stringify(user));
        },
        SET_ORGANIZERS(state, organizers) {
            state.organizers = organizers;
        },
        CLEAR_USER(state) {
            state.user = null;
            localStorage.removeItem('user');
            window.location.href = '/';
        },
        UPDATE_TEAM(state, updatedTeam) {
            const index = state.teams.findIndex(team => team.team_id === updatedTeam.team_id);
            if (index !== -1) {
                Vue.set(state.teams, index, updatedTeam);
            }
        },
    },
    actions: {
        /**
         * Fetch all tournaments from the backend
         */
        fetchTournaments({ commit }) {
            return axios.get('tournament/')
                .then(response => {
                    commit('SET_TOURNAMENTS', response.data);
                })
                .catch(error => {
                    console.error('Error fetching tournaments:', error);
                    throw error;
                });
        },

        /**
         * Fetch all players from the backend
         */
        async fetchPlayers({ commit }) {
            try {
                const response = await axios.get('/players');
                commit('SET_PLAYERS', response.data);  // Optional mutation if you need to store it
                return response.data; // Make sure this returns the player data array
            } catch (error) {
                console.error('Error fetching players:', error);
                throw error;
            }
        },
        /**
        * Fetch a specific player by ID (optional)
        */
        fetchPlayerById({ commit }, playerId) {
            return axios.get(`players/${playerId}`)
            .then((response) => {
                commit('SET_PLAYER', response.data);
            })
            .catch((error) => {
                console.error('Error fetching player:', error);
                throw error;
            });
        },
        async fetchPlayerStats(_, playerId) {
            try {
                const response = await axios.get(`/playerStats/${playerId}`);
                return response.data; // Ensure it returns the array directly
            } catch (error) {
                console.error('Error fetching player stats:', error);
                throw error;
            }
        },
        async fetchPlayerRanking(_, playerId) {
            try {
                const response = await axios.get(`/ranking/player/${playerId}`);
                return response.data; // Return the player ranking data
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
        updatePlayer({ dispatch }, { playerId, playerData }) {
            return axios.put(`/players/${playerId}`, playerData).then(() => {
                return dispatch('fetchPlayers');
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
        /**
         * Fetch all teams from the backend
         */
        fetchTeams({ commit }) {
            return axios.get('/team') // Adjust the endpoint if necessary
                .then(response => {
                    commit('SET_TEAMS', response.data);
                    return response.data; // Ensure teams are returned
                })
                .catch(error => {
                    console.error('Error fetching teams:', error);
                    throw error;
                });
        },
        async fetchTeamStats(_, teamId) {
            try {
                const response = await axios.get(`/teamStats/team/${teamId}`);
                console.log('API response for team stats:', response.data); // Debugging log
                return response.data; // Ensure it returns the array directly
            } catch (error) {
                console.error('Error fetching team stats:', error);
                throw error;
            }
        },
        createTeam({ dispatch }, { team_name, player_ids }) {
            console.log('Data being sent to backend:', { team_name, player_ids });
            return axios.post('/team', { team_name, player_ids })
                .then(() => dispatch('fetchTeams'))
                .catch(error => {
                    console.error('Error creating team:', error);
                    throw error;
                });
        },
        updateTeam({ dispatch }, { teamId, teamData }) {
            console.log('Updating team:', teamId, 'with data:', teamData);

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
            return axios.post('/players/login', credentials)
                .then(response => {
                    const user = response.data;
                    commit('SET_USER', user);
                    if (user.account_type === 'admin') {
                        window.location.href = '/admin/dashboard';
                    } else {
                        window.location.href = '/';
                    }
                })
                .catch(error => {
                    console.error('Error logging in:', error.response ? error.response.data : error);
                    throw error;
                });
        },


        /**
         * Logout user
         */
        logout({ commit }) {
            commit('CLEAR_USER');
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
