import Chat from "@/types/chat/Chat.ts";

export default interface ChatsResponse {
    chats: Chat[];
    nextPageNumber: number | null;
}
