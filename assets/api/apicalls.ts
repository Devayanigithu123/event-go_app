import axios from 'axios';

const api = axios.create({
    baseURL: 'http://your-backend-url/api',
});

export default api;