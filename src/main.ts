import App from './App.vue';
import './assets/style.css';
import { router } from './router';
import { createApp } from 'vue';

const app = createApp(App);

app.use(router);

app.mount('#app');
