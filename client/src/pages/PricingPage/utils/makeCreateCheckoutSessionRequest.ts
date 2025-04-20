import api from "@/lib/backend/api";

export default async function makeCreateCheckoutSessionRequest(priceId: string) {
    const { data } = await api.post<{ redirectUrl: string }>("stripe/checkout-session/create", {
        priceId,
    });

    return data.redirectUrl;
}