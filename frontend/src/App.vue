<!-- src/App.vue -->
<template>
  <div id="app">
    <Navbar />
    <b-container fluid class="p-0">
      <router-view></router-view>
    </b-container>
  </div>
</template>

<script>
import Navbar from './components/NavBar.vue';

export default {
  name: 'App',
  components: {
    Navbar,
  },
};
</script>

<style>
@import './assets/css/app.css';
</style>
