import Vue from 'vue';
import Vuex from 'vuex';
import axios from '../axios';

Vue.use(Vuex);

export default new Vuex.Store({
    state: {
        tournaments: [],
        players: [],
        teams: [],
        activities: [],
        organizers: [],
        user: JSON.parse(localStorage.getItem('user')) || null,
    },
    mutations: {
        SET_TOURNAMENTS(state, tournaments) {
            state.tournaments = tournaments;
        },
        SET_PLAYERS(state, players) {
            state.players = players;
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
        fetchPlayers({ commit }) {
            return axios.get('players/')
                .then(response => {
                    commit('SET_PLAYERS', response.data);
                })
                .catch(error => {
                    console.error('Error fetching players:', error);
                    throw error;
                });
        },
        fetchTeams({ commit }) {
            return axios.get('team/')
                .then(response => {
                    commit('SET_TEAMS', response.data);
                })
                .catch(error => {
                    console.error('Error fetching teams:', error);
                    throw error;
                });
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
        logout({ commit }) {
            commit('CLEAR_USER');
        },
    },
    getters: {
        allTournaments: (state) => state.tournaments,
        allPlayers: (state) => state.players,
        allTeams: (state) => state.teams,
        allActivities: (state) => state.activities,
        allOrganizers: (state) => state.organizers,
        isLoggedIn: (state) => !!state.user,
        currentUser: (state) => state.user,
        userRole: (state) => (state.user ? state.user.account_type : null),
    },
});
