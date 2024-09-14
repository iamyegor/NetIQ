import React, { useMemo } from "react";
import { Chat, Message } from "@/pages/ChatPage/types.ts";
import AddSvg from "@/assets/pages/chat/add.svg?react";
import { Button } from "@/components/ui/button.tsx";
import { FiSidebar } from "react-icons/fi";
import CategoryChats from "@/pages/ChatPage/CategoryChats.tsx";

const Sidebar = ({
    isSidebarExpanded,
    toggleSidebar,
    createNewChat,
    chats,
    currentChatId,
    setCurrentChatId,
}: {
    isSidebarExpanded: boolean;
    toggleSidebar: () => void;
    createNewChat: () => void;
    chats: Chat[];
    currentChatId: string | null;
    setCurrentChatId: (id: string) => void;
}) => {
    const categorizeChats = (chats: Chat[]) => {
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
                    new Date(chat.lastUpdatedAt) >= yesterday &&
                    new Date(chat.lastUpdatedAt) < today,
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
    };

    const categorizedChats = useMemo(() => categorizeChats(chats), [chats.length]);

    return (
        <aside className="ease-in-out flex">
            <div
                className={`bg-neutral-900 ${isSidebarExpanded ? "w-72" : "w-0"} transition-all relative overflow-y-scroll`}
            >
                <div className="p-2.5 py-4 space-y-4">
                    <div className="flex flex-col gap-y-4">
                        <Button onClick={toggleSidebar} variant="ghost" size="icon">
                            <FiSidebar className="h-6 w-6 text-white" />
                        </Button>
                        <Button onClick={createNewChat} className="flex gap-x-3 min-w-[260px]">
                            <AddSvg className="h-6 w-6" />
                            <p>New chat</p>
                        </Button>
                    </div>
                    <div className="space-y-1 w-full h-full">
                        <CategoryChats
                            categoryTitle="Сегодня"
                            chats={categorizedChats.today}
                            currentChatId={currentChatId}
                            setCurrentChatId={setCurrentChatId}
                        />
                        <CategoryChats
                            categoryTitle="Вчера"
                            chats={categorizedChats.yesterday}
                            currentChatId={currentChatId}
                            setCurrentChatId={setCurrentChatId}
                        />
                        <CategoryChats
                            categoryTitle="Последние 7 дней"
                            chats={categorizedChats.previousSevenDays}
                            currentChatId={currentChatId}
                            setCurrentChatId={setCurrentChatId}
                        />
                        <CategoryChats
                            categoryTitle="Последние 30 дней"
                            chats={categorizedChats.previousThirtyDays}
                            currentChatId={currentChatId}
                            setCurrentChatId={setCurrentChatId}
                        />
                    </div>
                </div>
            </div>
        </aside>
    );
};

export default Sidebar;
