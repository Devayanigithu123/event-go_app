import axios from 'axios';

const api = axios.create({
    baseURL: 'http://10.0.2.2:8000/api', // Use 10.0.2.2 for Android emulator to access host machine
});

export default api;
