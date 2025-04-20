import api from "@/lib/backend/api.ts";
import useModelStore from "@/lib/zustand/model/useModelStore";
import Subscription from "@/types/chat/Subscription";
import { useQuery } from "@tanstack/react-query";
import { useEffect } from "react";

async function fetchSubscription() {
    const { data } = await api.get<{ subscription: Subscription }>("user/subscription");
    return data.subscription;
}

export default function useSubscription() {
    const { data: subscription } = useQuery({
        queryKey: ["subscription"],
        queryFn: () => fetchSubscription(),
    });
    const { setSubscription } = useModelStore();

    useEffect(() => {
        setSubscription(subscription ?? null);
    }, [subscription]);

    return { subscription: subscription ?? null };
}
