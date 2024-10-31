import Chat from "@/types/chat/Chat.ts";
import ChatsResponse from "@/types/chat/ChatsResponse.ts";
import { useQueryClient } from "@tanstack/react-query";

export default function useChatManagement() {
    const queryClient = useQueryClient();

    function mutateChats(mutator: (pages: ChatsResponse[]) => ChatsResponse[]) {
        queryClient.setQueryData<{ pages: ChatsResponse[] }>(["chats"], (oldData) => {
            if (!oldData) return { pages: [] };
            const newPages = mutator(oldData.pages);
            return { ...oldData, pages: newPages };
        });
    }

    function addChat(newChat: Chat) {
        mutateChats((pages) => {
            const newPages = [...pages];
            if (newPages.length > 0) {
                newPages[0] = { ...newPages[0], chats: [newChat, ...newPages[0].chats] };
            } else {
                newPages.push({ chats: [newChat], nextPageNumber: null });
            }
            return newPages;
        });
    }

    return { addChat };
}
