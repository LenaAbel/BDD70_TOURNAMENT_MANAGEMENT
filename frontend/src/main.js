import Vue from 'vue'
import App from './App.vue'
import { BootstrapVue, IconsPlugin, BIcon } from 'bootstrap-vue';
import axios from 'axios';

// Import Bootstrap and BootstrapVue CSS files (order is important)
import 'bootstrap/dist/css/bootstrap.css';
import 'bootstrap-vue/dist/bootstrap-vue.css';

Vue.config.productionTip = false

// Make BootstrapVue available throughout the project
Vue.use(BootstrapVue);
Vue.use(IconsPlugin);
Vue.component('BIcon', BIcon);

axios.defaults.baseURL = 'http://localhost:3000';
axios.defaults.headers.common['Access-Control-Allow-Origin'] = '*';

new Vue({
  render: h => h(App),
}).$mount('#app')
