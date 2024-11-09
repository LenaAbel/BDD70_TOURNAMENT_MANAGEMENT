// src/router/index.js

import Vue from 'vue';
import Router from 'vue-router';
import mainHome from '../components/home/mainHome.vue';
import TournamentsList from '../components/home/TournamentsList.vue';
import PlayersList from '../components/home/PlayersList.vue';
import TeamsList from '../components/home/TeamsList.vue';
import ActivitiesList from '../components/home/ActivitiesList.vue';
import PlayerDisplay from '../components/home/Player/PlayerDisplay.vue';
import ActivityDisplay from '../components/home/Activity/ActivityDisplay.vue';
import TournamentDisplay from '../components/home/Tournament/TournamentDisplay.vue';

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
            path: '/tournaments/:id',
            name: 'TournamentDisplay',
            component: TournamentDisplay,
            props: true,  // Pass the route parameters as props to the component
        },
        {
            path: '/players',
            name: 'Players',
            component: PlayersList,
        },
        {
            path: '/players/:id',
            name: 'PlayerDisplay',
            component: PlayerDisplay,
            props: true,
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
            path: '/activities/:id',
            name: 'ActivityDisplay',
            component: ActivityDisplay,
            props: true, // Pass the route parameter as a prop to the component
        },
        {
            path: '*',
            redirect: '/',
        },
    ],
});
