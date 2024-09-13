import { http, HttpResponse } from "msw";

export const serverAddress = "https://localhost:7071/api";

export const handlers = [
    http.get(`${serverAddress}/data`, async () => {
        await new Promise((resolve) => setTimeout(resolve, 1000));
        return HttpResponse.json("Idi nahuy");
    }),
];
