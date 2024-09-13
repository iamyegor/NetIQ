import { Chat } from "@/pages/ChatPage/types.ts";
import AddSvg from "@/assets/pages/chat/add.svg?react";
import { Button } from "@/components/ui/button.tsx";
import { FiSidebar } from "react-icons/fi";
import React from "react";

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
}) => (
    <aside className="ease-in-out flex">
        <div
            className={`bg-neutral-900 ${isSidebarExpanded ? "w-72" : "w-0"} transition-all relative overflow-y-scroll`}
        >
            <div className="p-2.5 py-4 space-y-4">
                <div className="flex flex-col gap-y-4">
                    <Button onClick={toggleSidebar} variant="ghost" size="icon">
                        <FiSidebar className="h-6 w-6 text-white" />
                    </Button>
                    <Button onClick={createNewChat} className="flex gap-x-3 min-w-[253px]">
                        <AddSvg className="h-6 w-6" />
                        <p>New chat</p>
                    </Button>
                </div>
                <div className="space-y-1 w-full h-full">
                    {chats.map((chat, index) => (
                        <Button
                            key={index}
                            onClick={() => setCurrentChatId(chat.id)}
                            variant={currentChatId === chat.id ? "secondary" : "ghost"}
                            className="w-full justify-start text-white !text-sm font-normal h-9"
                        >
                            <p className="overflow-hidden whitespace-nowrap truncate pt-0.5 pb-0.5">
                                {chat.title}
                            </p>
                        </Button>
                    ))}
                </div>
            </div>
        </div>
    </aside>
);

export default Sidebar;
