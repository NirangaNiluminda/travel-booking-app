import axios from "axios"

const baseURL = "http://3.25.181.121:3000/api/"

const AXIOS_API = axios.create({
    baseURL
})

export default AXIOS_API