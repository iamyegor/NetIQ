import Chat from "@/types/chat/Chat.ts";

export default function categorizeChats(chats: Chat[]) {
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);
    const sevenDaysAgo = new Date(today);
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
    const thirtyDaysAgo = new Date(today);
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    return {
        today: chats.filter((chat) => new Date(chat.lastUpdatedAt) >= today),
        yesterday: chats.filter(
            (chat) =>
                new Date(chat.lastUpdatedAt) >= yesterday && new Date(chat.lastUpdatedAt) < today,
        ),
        previousSevenDays: chats.filter(
            (chat) =>
                new Date(chat.lastUpdatedAt) >= sevenDaysAgo &&
                new Date(chat.lastUpdatedAt) < yesterday,
        ),
        previousThirtyDays: chats.filter(
            (chat) =>
                new Date(chat.lastUpdatedAt) >= thirtyDaysAgo &&
                new Date(chat.lastUpdatedAt) < sevenDaysAgo,
        ),
    };
}
