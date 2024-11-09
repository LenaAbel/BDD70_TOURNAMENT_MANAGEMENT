// src/store/index.js

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
                commit('SET_PLAYERS', [response.data]);  // You might want to replace or append depending on structure
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
    },
    getters: {
        allTournaments: (state) => state.tournaments,
        allPlayers: (state) => state.players,
        allTeams: (state) => state.teams,
        allActivities: (state) => state.activities,
    },
});
