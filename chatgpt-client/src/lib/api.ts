import axios, { AxiosError, AxiosRequestConfig, AxiosResponse } from "axios";
import ServerErrorResponse from "@/types/errors/ServerErrorResponse.ts";

const api = axios.create({
    baseURL: "https://" + import.meta.env.VITE_BACKEND_ADDRESS + "/api",
    withCredentials: true,
});

interface CustomAxiosRequestConfig extends AxiosRequestConfig {
    _retry?: boolean;
}

api.interceptors.response.use(
    (response: AxiosResponse): AxiosResponse => {
        return response;
    },

    async (error: AxiosError<ServerErrorResponse>): Promise<any> => {
        const originalRequest = error.config as CustomAxiosRequestConfig;

        try {
            if (originalRequest._retry) {
                return Promise.reject(error);
            }
            originalRequest._retry = true;

            if (error.response?.data?.errorCode === "device.id.is.invalid") {
                await issueNewDeviceId();
            } else if (error.response?.status === 401) {
                await refreshToken();
            } else {
                return Promise.reject(error);
            }

            return api(originalRequest);
        } catch (newRequestError) {
            return Promise.reject(newRequestError);
        }
    },
);

async function refreshToken(): Promise<any> {
    await api.post("refresh-access-token");
}

async function issueNewDeviceId(): Promise<any> {
    await api.post("issue-device-id");
}

export default api;
