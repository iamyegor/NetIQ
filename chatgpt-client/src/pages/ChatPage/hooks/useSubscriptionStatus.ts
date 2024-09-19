import { useQuery } from "@tanstack/react-query";
import api from "@/lib/api.ts";
import { SubscriptionStatus } from "@/pages/ChatPage/types.ts";


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
