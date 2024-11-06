import Vue from 'vue'
import App from './App.vue'
import { BootstrapVue, IconsPlugin, BIcon } from 'bootstrap-vue';
import axios from './axios'; // Import the Axios instance
import router from './router/router.js'
import store from './store/index.js'
// Import Bootstrap and BootstrapVue CSS files (order is important)
import 'bootstrap/dist/css/bootstrap.css';
import 'bootstrap-vue/dist/bootstrap-vue.css';

// Import custom CSS styles
import './assets/css/app.css';

Vue.config.productionTip = false

// Make BootstrapVue available throughout the project
Vue.use(BootstrapVue);
Vue.use(IconsPlugin);
Vue.component('BIcon', BIcon);

Vue.prototype.$axios = axios;

new Vue({
  router,
  store,
  render: h => h(App),
}).$mount('#app')
