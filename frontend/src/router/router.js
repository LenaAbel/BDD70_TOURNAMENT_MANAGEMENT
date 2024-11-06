// src/router/index.js

import Vue from 'vue';
import Router from 'vue-router';
import mainHome from '../components/home/mainHome.vue';
import TournamentsList from '../components/home/TournamentsList.vue';
import PlayersList from '../components/home/PlayersList.vue';
import TeamsList from '../components/home/TeamsList.vue';
import ActivitiesList from '../components/home/ActivitiesList.vue';

Vue.use(Router);

export default new Router({
    mode: 'history',
    routes: [
        {
            path: '/',
            name: 'Home',
            component: mainHome,
        },
        {
            path: '/tournaments',
            name: 'Tournaments',
            component: TournamentsList,
        },
        {
            path: '/players',
            name: 'Players',
            component: PlayersList,
        },
        {
            path: '/teams',
            name: 'Teams',
            component: TeamsList,
        },
        {
            path: '/activities',
            name: 'Activities',
            component: ActivitiesList,
        },
        {
            path: '*',
            redirect: '/',
        },
    ],
});
