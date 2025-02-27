import axios from "axios"

const baseURL = "http://3.25.181.121:3000/api/"

const AXIOS_API = axios.create({
    baseURL,
    headers: {
        'Content-Type': 'application/json',
    }
})

// Add a request interceptor to disable caching for GET requests
AXIOS_API.interceptors.request.use(function (config) {
    if (config.method === 'get') {
        // Add timestamp to all GET requests
        const timestamp = new Date().getTime();
        config.params = {
            ...config.params,
            _t: timestamp
        };
        
        // Add cache control headers
        config.headers = {
            ...config.headers,
            'Cache-Control': 'no-cache, no-store, must-revalidate',
            'Pragma': 'no-cache',
            'Expires': '0'
        };
    }
    return config;
}, function (error) {
    return Promise.reject(error);
});

export default AXIOS_API