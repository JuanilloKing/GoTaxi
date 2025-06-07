import axios from 'axios';

window.axios = axios;

axios.defaults.headers.common['X-Requested-With'] = 'XMLHttpRequest';

const token = document.querySelector('meta[name="csrf-token"]');

if (token) {
    axios.defaults.headers.common['X-CSRF-TOKEN'] = token.content;
} else {
    console.error('⚠️ CSRF token no encontrado. Asegúrate de incluir <meta name="csrf-token"> en tu layout.');
}

export default axios;
