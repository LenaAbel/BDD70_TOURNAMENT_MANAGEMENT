// src/store/index.js

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
        CLEAR_USER(state) {
            state.user = null;
            localStorage.removeItem('user');
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
        /**
         * Fetch all teams from the backend
         */
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
        /**
         * Fetch all activities from the backend
         */
        fetchActivities({ commit }) {
            return axios.get('activity/')
                .then(response => {
                    commit('SET_ACTIVITIES', response.data);
                })
                .catch(error => {
                    console.error('Error fetching activities:', error);
                    throw error;
                });
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
            console.log('Attempting login with credentials:', credentials);  // Debug log
            return axios
                .post('/players/login', credentials)
                .then((response) => {
                    const user = response.data;
                    console.log('Login successful:', user);  // Check login success
                    commit('SET_USER', user);
                    if (user.account_type === 'admin') {
                        window.location.href = '/admin/dashboard';
                    } else {
                        window.location.href = '/';
                    }
                })
                .catch((error) => {
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
            return axios
                .post('/api/tournament', tournamentData)
                .then(() => {
                    dispatch('fetchTournaments');
                })
                .catch((error) => {
                    console.error('Error creating tournament:', error);
                    throw error;
                });
        },
        updateTournament({ dispatch }, { tournamentId, tournamentData }) {
            return axios
                .put(`/api/tournament/${tournamentId}`, tournamentData)
                .then(() => {
                    dispatch('fetchTournaments');
                })
                .catch((error) => {
                    console.error('Error updating tournament:', error);
                    throw error;
                });
        },
        deleteTournament({ dispatch }, tournamentId) {
            return axios
                .delete(`/api/tournament/${tournamentId}`)
                .then(() => {
                    dispatch('fetchTournaments');
                })
                .catch((error) => {
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
        isLoggedIn: (state) => !!state.user,
        currentUser: (state) => state.user,
        userRole: (state) => (state.user ? state.user.account_type : null),
    },
});
