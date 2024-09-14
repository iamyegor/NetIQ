import React from "react";
import { Chat } from "@/pages/ChatPage/types.ts";
import { Button } from "@/components/ui/button.tsx";

interface CategoryChatsProps {
    categoryTitle: string;
    chats: Chat[];
    currentChatId: string | null;
    setCurrentChatId: (id: string) => void;
}

const CategoryChats: React.FC<CategoryChatsProps> = ({
    categoryTitle,
    chats,
    currentChatId,
    setCurrentChatId,
}) => {
    if (chats.length === 0) return null;

    return (
        <div className="space-y-0.5">
            <h3 className="text-sm font-semibold text-neutral-300 mt-8 mb-2 pl-4">{categoryTitle}</h3>
            {chats.map((chat, index) => (
                <Button
                    key={index}
                    onClick={() => setCurrentChatId(chat.id)}
                    variant={currentChatId === chat.id ? "secondary" : "ghost"}
                    className="w-full justify-start text-white !text-sm font-normal h-9 min-w-[260px] mb-1"
                >
                    <p className="overflow-hidden whitespace-nowrap truncate pt-0.5 pb-0.5">
                        {chat.title}
                    </p>
                </Button>
            ))}
        </div>
    );
};

export default CategoryChats;
