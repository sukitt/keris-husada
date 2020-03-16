import Axios from 'axios';

// base url
const endpoint = 'kerishusadawebservice.herokuapp.com'
const HOME = '192.168.0.2:8000';
const KAMPUS = '192.168.1.179:8000';
const KAMPUS1 = '192.168.77.171:8000';
export let BaseURL = `http://${HOME}`;

// base method
export const axiosBase = Axios.create({
    baseURL: `${BaseURL}/api/v1`,
    timeout: 10000,
    headers: { 'Content-Type': 'application/json' }
})