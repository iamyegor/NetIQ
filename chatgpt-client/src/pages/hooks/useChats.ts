import { useInfiniteQuery, useQueryClient } from "@tanstack/react-query";
import api from "@/lib/api";
import { useInView } from "react-intersection-observer";
import { useCallback, useEffect, useState } from "react";
import { Chat, ChatsResponse } from "@/pages/ChatPage/types";

export default function useChats() {
    const queryClient = useQueryClient();
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
    }, [chats.length, inView]);

    const mutateChats = useCallback(
        (mutator: (pages: ChatsResponse[]) => ChatsResponse[]) => {
            queryClient.setQueryData<{ pages: ChatsResponse[] }>(["chats"], (oldData) => {
                if (!oldData) return { pages: [] };
                const newPages = mutator(oldData.pages);
                return { ...oldData, pages: newPages };
            });
        },
        [queryClient],
    );

    const addChat = useCallback(
        (newChat: Chat) => {
            mutateChats((pages) => {
                const newPages = [...pages];
                if (newPages.length > 0) {
                    newPages[0] = { ...newPages[0], chats: [newChat, ...newPages[0].chats] };
                } else {
                    newPages.push({ chats: [newChat], nextPageNumber: null });
                }
                return newPages;
            });
        },
        [mutateChats],
    );

    return {
        chats,
        chatsLoading: isLoading,
        addChat,
        chatsEndRef: ref,
        allChatsLoaded: !hasNextPage,
    };
}
