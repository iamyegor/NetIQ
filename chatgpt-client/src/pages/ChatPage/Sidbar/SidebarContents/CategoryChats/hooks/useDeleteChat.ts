import api from "@/lib/backend/api.ts";
import { InfiniteData, useMutation, useQueryClient } from "@tanstack/react-query";
import ChatsResponse from "@/types/chat/ChatsResponse.ts";

export function useDeleteChat() {
    const queryClient = useQueryClient();
    const deleteChatMutation = useMutation({
        mutationFn: (chatId: string) => api.delete(`chats/${chatId}`),
        onMutate: async (chatId) => {
            await queryClient.cancelQueries({ queryKey: ["chats"] });

            const previousData = queryClient.getQueryData<InfiniteData<ChatsResponse>>(["chats"]);

            queryClient.setQueryData<InfiniteData<ChatsResponse>>(["chats"], (data) => {
                if (!data) return data;

                return {
                    ...data,
                    pages: data.pages.map((page) => ({
                        ...page,
                        chats: page.chats.filter((chat) => chat.id !== chatId),
                    })),
                };
            });

            return { previousData };
        },
        onError: (_, __, context) => queryClient.setQueryData(["chats"], context?.previousData),
        onSettled: () => queryClient.invalidateQueries({ queryKey: ["chats"] }),
    });

    return { deleteChat: deleteChatMutation };
}
