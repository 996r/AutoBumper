import axios from "axios";


const api = axios.create({
    baseURL: "http://192.168.5.102:3001",
    headers: {
        "Content-Type": "application/json",
    },
});


export default api;