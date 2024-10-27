import interceptor from "@/lib/backend/interceptor";
import axios, { AxiosResponse } from "axios";

const api = axios.create({
    baseURL: "https://" + import.meta.env.VITE_BACKEND_ADDRESS + "/api",
    withCredentials: true,
});

api.interceptors.response.use((response: AxiosResponse): AxiosResponse => {
    return response;
}, interceptor);

export default api;
