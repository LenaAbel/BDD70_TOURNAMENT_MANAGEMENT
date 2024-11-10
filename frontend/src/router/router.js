// src/router/index.js

import Vue from 'vue';
import Router from 'vue-router';
import store from '../store';
import mainHome from '../components/home/mainHome.vue';
import TournamentsList from '../components/home/TournamentsList.vue';
import PlayersList from '../components/home/PlayersList.vue';
import TeamsList from '../components/home/TeamsList.vue';
import ActivitiesList from '../components/home/ActivitiesList.vue';
import mainRegister from '../components/home/mainRegister.vue';
import mainLogin from '../components/home/mainLogin.vue';
import ActivityDisplay from "@/components/home/Activity/ActivityDisplay.vue";
import PlayerDisplay from "@/components/home/Player/PlayerDisplay.vue";
import TournamentDisplay from "@/components/home/Tournament/TournamentDisplay.vue";
import AdminTournaments from '../components/admin/AdminTournaments.vue';
import AdminDashboard from "@/components/admin/AdminDashboard.vue";

Vue.use(Router);

const router = new Router({
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
            path: '/register',
            name: 'Register',
            component: mainRegister,
        },
        {
            path: '/login',
            name: 'Login',
            component: mainLogin,
        },
        {
            path: '/admin/tournaments',
            name: 'AdminTournaments',
            component: AdminTournaments,
            meta: {requiresAuth: true, requiresAdmin: true},
        },
        {
            path: '/admin/dashboard',
            name: 'AdminDashboard',
            component: AdminDashboard,
            meta: { requiresAuth: true, requiresAdmin: true },
        },
        {
            path: '*',
            redirect: '/',
        },
    ],
});

// Navigation guard
router.beforeEach((to, from, next) => {
    const { requiresAuth, requiresAdmin } = to.meta;
    const isLoggedIn = store.getters.isLoggedIn;
    const userRole = store.getters.userRole;

    if (requiresAuth && !isLoggedIn) {
        next('/login');
    } else if (requiresAdmin && userRole !== 'admin') {
        next('/');
    } else {
        next();
    }
});


export default router;