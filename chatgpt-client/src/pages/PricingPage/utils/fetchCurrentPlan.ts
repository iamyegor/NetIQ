import api from "@/lib/backend/api";

export default async function fetchSubscriptionPriceId() {
    const { data } = await api.get("stripe/subscription/price-id");
    return data.priceId;
}
