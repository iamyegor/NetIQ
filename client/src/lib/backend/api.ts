import interceptor from "@/lib/backend/interceptor";
import axios, { AxiosResponse } from "axios";

const api = axios.create({
    baseURL: import.meta.env.VITE_BACKEND_ADDRESS,
    withCredentials: true,
});

api.interceptors.response.use((response: AxiosResponse): AxiosResponse => {
    return response;
}, interceptor);

export default api;
