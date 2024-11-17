<template>
  <div>
    <b-navbar
        toggleable="lg"
        type="dark"
        variant="dark"
        class="fixed-top navbar-custom"
        style="padding: 3px 0;"
    >
      <b-navbar-brand href="/" class="ml-3">
        <img
            src="../assets/logo.png"
            alt="Logo"
            width="45"
            height="40"
            style="margin: 5px"
            class="d-inline-block rounded align-top"
        />
      </b-navbar-brand>

      <b-navbar-toggle target="nav-collapse"></b-navbar-toggle>

      <b-collapse id="nav-collapse" is-nav>
        <!-- Left-aligned navigation items -->
        <b-navbar-nav>
          <!-- Show public navigation items only when the user is not logged in -->
          <template v-if="!isLoggedIn">
            <b-nav-item href="/">
              <b-icon icon="house-door-fill" class="mr-1"></b-icon> Home
            </b-nav-item>
            <b-nav-item href="/tournaments">
              <b-icon icon="trophy-fill" class="mr-1"></b-icon> Tournaments
            </b-nav-item>
            <b-nav-item href="/players">
              <b-icon icon="people-fill" class="mr-1"></b-icon> Players
            </b-nav-item>
            <b-nav-item href="/teams">
              <b-icon icon="people" class="mr-1"></b-icon> Teams
            </b-nav-item>
            <b-nav-item href="/activities">
              <b-icon icon="dice-5-fill" class="mr-1"></b-icon> Activities
            </b-nav-item>
            <b-nav-item href="/rewards">
              <b-icon icon="dice-5-fill" class="mr-1"></b-icon> Rewards
            </b-nav-item>
          </template>

          <!-- Admin Options - visible only if logged in and user is an admin -->
          <template v-if="isLoggedIn && userRole === 'admin'">
            <b-nav-item href="/admin/tournaments">
              <b-icon icon="trophy-fill" class="mr-1"></b-icon> Manage Tournaments
            </b-nav-item>
            <b-nav-item href="/admin/players">
              <b-icon icon="people-fill" class="mr-1"></b-icon> Manage Players
            </b-nav-item>
            <b-nav-item href="/admin/teams">
              <b-icon icon="people" class="mr-1"></b-icon> Manage Teams
            </b-nav-item>
            <b-nav-item href="/admin/activities">
              <b-icon icon="dice-5-fill" class="mr-1"></b-icon> Manage Activities
            </b-nav-item>
            <b-nav-item href="/admin/statistics">
              <b-icon icon="bar-chart-fill" class="mr-1"></b-icon> Statistics
            </b-nav-item>
            <b-nav-item href="/rewards">
              <b-icon icon="dice-5-fill" class="mr-1"></b-icon> Rewards
            </b-nav-item>
          </template>
        </b-navbar-nav>

        <!-- Right-aligned navigation items -->
        <b-navbar-nav class="ml-auto mr-3">
          <!-- Show Account dropdown if the user is logged in -->
          <template v-if="isLoggedIn">
            <b-nav-item-dropdown text="Account" right>
              <b-dropdown-item @click="$router.push('/profile')">
                Profile
              </b-dropdown-item>
              <b-dropdown-item @click="logout">Logout</b-dropdown-item>
            </b-nav-item-dropdown>
          </template>

          <!-- Show Login and Register options if the user is not logged in -->
          <template v-else>
            <b-nav-item href="/login">
              <b-icon icon="box-arrow-in-right" class="mr-1"></b-icon> Login
            </b-nav-item>
            <b-nav-item href="/register">
              <b-icon icon="person-plus-fill" class="mr-1"></b-icon> Register
            </b-nav-item>
          </template>
        </b-navbar-nav>
      </b-collapse>
    </b-navbar>
  </div>
</template>

<script>
import { mapGetters, mapActions } from 'vuex';

export default {
  name: 'NavBar',

  computed: {
    ...mapGetters(['isLoggedIn', 'userRole']),
  },
  methods: {
    ...mapActions(['logout']),
  },
};
</script>

<style scoped>
.navbar-custom {
  background-color: var(--navyblue) !important;
}

.nav-link {
  color: var(--pink) !important;
  font-weight: bold;
  transition: all 0.3s ease;
  padding: 5px 10px;
  border-radius: 15px;
}

.nav-link:hover {
  color: var(--pink) !important;
  background-color: rgba(255, 255, 255, 0.2);
  text-decoration: none;
}

.navbar-brand img {
  animation: rotate 8s infinite alternate;
}

/* Dropdown menu styling */
.dropdown-menu {
  background-color: var(--navyblue);
}

.dropdown-item {
  color: var(--pink) !important;
}

.dropdown-item:hover {
  background-color: var(--darkblue) !important;
  color: var(--pink) !important;
}
</style>
