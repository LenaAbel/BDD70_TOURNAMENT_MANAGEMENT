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
import AdminPlayers from "@/components/admin/AdminPlayers.vue";
import AdminTeams from "@/components/admin/AdminTeams.vue";
import AdminStatistics from "../components/admin/AdminStatistics.vue";
import PlayerHome from '../components/home/Player/PlayerHome.vue';
import PlayerRegisterTournament from "@/components/home/Player/PlayerRegisterTournament.vue";
import PlayerProfile from "@/components/home/Player/PlayerProfile.vue";
import RewardsAndRankings from "@/components/home/RewardsAndRankings.vue";

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
            path: '/players/:playerId',
            name: 'PlayerDisplay',
            component: PlayerDisplay,
            props: route => {
                return { playerId: Number(route.params.playerId) };
            }
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
            path: '/rewards',
            name: 'RewardsAndRankings',
            component: RewardsAndRankings,
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
            meta: { requiresAuth: true, requiresAdmin: true },
        },
        {
            path: '/admin/players',
            name: 'AdminPlayers',
            component: AdminPlayers,
            meta: { requiresAuth: true, requiresAdmin: true },
        },
        {
          path: '/admin/teams',
            name: 'AdminTeams',
            component: AdminTeams,
            meta: { requiresAuth: true, requiresAdmin: true },
        },
        {
            path: '/admin/dashboard',
            name: 'AdminDashboard',
            component: AdminDashboard,
            meta: { requiresAuth: true, requiresAdmin: true },
        },{
            path: '/admin/statistics',
            name: 'AdminStatistics',
            component: AdminStatistics,
            meta: { requiresAuth: true, requiresAdmin: true },
        },
        {
            path: '/home',
            name: 'PlayerHome',
            component: PlayerHome,
            meta: { requiresAuth: true },
        },
        {
            path: "/register-tournament",
            name: "PlayerRegisterTournament",
            component: PlayerRegisterTournament,
            meta: { requiresAuth: true },
        },
        {
            path: "/profile",
            name: "PlayerProfile",
            component: PlayerProfile,
            meta: { requiresAuth: true },
        },
        {
            path: "/stats",
            name: "PlayerStats",
            component: () => import("@/components/home/Player/PlayerStats.vue"),
            meta: { requiresAuth: true },
        },
        {
            path: '*',
            redirect: '/',
        },
    ],
});

// Navigation guard
router.beforeEach((to, from, next) => {
    if (to.matched.some((record) => record.meta.requiresAuth)) {
        if (!store.getters.isLoggedIn) {
            next('/login'); // Redirect to login if not logged in
        } else {
            next(); // Proceed to the route
        }
    } else {
        next(); // Proceed to the route
    }
});

export default router;