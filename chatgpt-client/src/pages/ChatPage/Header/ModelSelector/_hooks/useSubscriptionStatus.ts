import api from "@/lib/backend/api.ts";
import { useQuery } from "@tanstack/react-query";
import SubscriptionStatus from "@/types/chat/SubscriptionStatus.ts";

async function fetchSubscriptionStatus() {
    const { data } = await api.get<{ subscriptionStatus: SubscriptionStatus }>(
        "user/subscription-status",
    );
    return data;
}

export default function useSubscriptionStatus() {
    const { data } = useQuery({
        queryKey: ["subscription-status"],
        queryFn: () => fetchSubscriptionStatus(),
    });

    return { subscriptionStatus: data?.subscriptionStatus ?? null };
}
