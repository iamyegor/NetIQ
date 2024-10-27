import api from "@/lib/backend/api";
import { SubscriptionStatus } from "@/pages/ChatPage/types.ts";
import { useQuery } from "@tanstack/react-query";


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
