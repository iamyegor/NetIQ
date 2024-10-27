import api from "@/lib/backend/api";
import { Chat, ChatsResponse } from "@/pages/ChatPage/types.ts";
import { useInfiniteQuery, useQueryClient } from "@tanstack/react-query";
import { useCallback, useEffect, useState } from "react";
import { useInView } from "react-intersection-observer";

export default function useChats() {
    const queryClient = useQueryClient();
    const [isEnabled, setIsEnabled] = useState(false);

    const { data, isLoading, fetchNextPage, hasNextPage, refetch } = useInfiniteQuery({
        queryKey: ["chats"],
        queryFn: fetchChats,
        initialPageParam: 1,
        getNextPageParam: (lastPage) => lastPage.nextPageNumber,
        gcTime: 0,
        retry: false,
        enabled: isEnabled,
    });

    async function fetchChats({ pageParam }: { pageParam: number }) {
        const { data } = await api.get<ChatsResponse>(`chats?page=${pageParam}`);
        return data;
    }

    const { inView, ref } = useInView();

    const chats = data?.pages.flatMap((page) => page.chats) || [];

    useEffect(() => {
        if (inView && hasNextPage && isEnabled) {
            fetchNextPage();
        }
    }, [chats.length, inView, isEnabled, hasNextPage, fetchNextPage]);

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

    const loadChats = useCallback(() => {
        setIsEnabled(true);
        refetch();
    }, [refetch]);

    return {
        chats,
        chatsLoading: isLoading,
        addChat,
        chatsEndRef: ref,
        allChatsLoaded: !hasNextPage,
        loadChats,
    };
}
