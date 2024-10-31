import api from "@/lib/backend/api.ts";
import ChatsResponse from "@/types/chat/ChatsResponse.ts";
import { useInfiniteQuery } from "@tanstack/react-query";
import { useEffect } from "react";
import { useInView } from "react-intersection-observer";

export default function useLoadChats() {
    const { data, isLoading, fetchNextPage, hasNextPage } = useInfiniteQuery({
        queryKey: ["chats"],
        queryFn: fetchChats,
        initialPageParam: 1,
        getNextPageParam: (lastPage) => lastPage.nextPageNumber,
        gcTime: 0,
        retry: false,
    });

    async function fetchChats({ pageParam }: { pageParam: number }) {
        const { data } = await api.get<ChatsResponse>(`chats?page=${pageParam}`);
        return data;
    }

    const { inView, ref } = useInView();

    const chats = data?.pages.flatMap((page) => page.chats) || [];

    useEffect(() => {
        if (inView && hasNextPage) {
            fetchNextPage();
        }
    }, [chats.length, inView, hasNextPage, fetchNextPage]);


    return {
        chats,
        chatsLoading: isLoading,
        chatsEndRef: ref,
        allChatsLoaded: !hasNextPage,
    };
}
