// src/axios.js

import axios from 'axios';
import store from './store/index';
import router from './router/router';

const instance = axios.create({
    baseURL: 'http://localhost:3000/api/',
    headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
    },
});
axios.interceptors.response.use(
    (response) => response, // Return response if successful
    (error) => {
        if (error.response?.status === 401) {
            store.dispatch('logout'); // Log the user out
            router.push('/login'); // Redirect to login page
        }
        return Promise.reject(error);
    }
);
export default instance;
