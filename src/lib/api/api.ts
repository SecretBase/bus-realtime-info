import axios from 'axios';

axios.defaults.adapter = 'fetch';

export const api = axios;
