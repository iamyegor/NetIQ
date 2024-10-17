import React, { useState } from "react";
import { Chat } from "@/pages/ChatPage/types.ts";
import { Button } from "@/components/ui/button.tsx";
import TrashBinSvg from "@/assets/pages/chat/trash.svg?react";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog.tsx";
import { Link, useNavigate } from "react-router-dom";
import { useDeleteChat } from "@/pages/ChatPage/hooks/useDeleteChat.ts";
import { useMediaQuery } from "react-responsive";
import { useAppContext } from "@/context/AppContext.tsx";

interface CategoryChatsProps {
    categoryTitle: string;
    chats: Chat[];
}

const CategoryChats: React.FC<CategoryChatsProps> = ({ categoryTitle, chats }) => {
    const isMdScreen = useMediaQuery({ minWidth: 768 });
    const [showDialog, setShowDialog] = useState(false);
    const [chatToDelete, setChatToDelete] = useState<string | null>(null);
    const { setIsSidebarExpanded, chatId, stopEventSource, setMessages } = useAppContext();
    const { deleteChat } = useDeleteChat();
    const navigate = useNavigate();

    function handleChatSwitch(newChat: string | undefined) {
        if (chatId === newChat) return;

        stopEventSource();
        setMessages([]);
        if (!isMdScreen) {
            setIsSidebarExpanded(false);
        }
    }

    async function handleDeleteChat() {
        if (!chatToDelete) return;

        if (chatToDelete === chatId) {
            setMessages([]);
            stopEventSource();
        }

        deleteChat.mutate(chatToDelete);
        setShowDialog(false);
        if (chatId === chatToDelete) {
            navigate("/chat");
        }
    }

    function handleShowDialog(e: React.MouseEvent<SVGSVGElement, MouseEvent>, chatId: string) {
        e.preventDefault();
        e.stopPropagation();
        setChatToDelete(chatId);
        setShowDialog(true);
    }

    if (chats.length === 0) return null;

    return (
        <div className="space-y-0.5">
            <Dialog open={showDialog} onOpenChange={(isOpen) => setShowDialog(isOpen)}>
                <DialogContent>
                    <DialogHeader className="text-white space-y-5">
                        <DialogTitle>Вы точно хотите продолжить?</DialogTitle>
                        <DialogDescription>
                            Это действие нельзя отменить. Это навсегда удалит ваш чат и все его
                            сообщения.
                        </DialogDescription>
                    </DialogHeader>
                    <DialogFooter>
                        <Button
                            className="!bg-red-600 !text-white"
                            onClick={() => handleDeleteChat()}
                        >
                            Удалить
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
            <h3 className="text-sm font-semibold text-neutral-300 mt-8 mb-2 pl-2 text-nowrap">
                {categoryTitle}
            </h3>
            {chats.map((chat, index) => (
                <Link
                    to={`/chats/${chat.id}`}
                    onClick={() => handleChatSwitch(chat.id)}
                    key={index}
                    className={`w-full flex justify-start items-center text-white !text-sm font-normal h-9 min-w-[260px] mb-1 space-x-3 !px-2 group relative p-2 hover:bg-neutral-800 rounded-lg transition ${chatId === chat.id ? "bg-neutral-800" : ""}`}
                >
                    <p className="overflow-hidden whitespace-nowrap truncate pt-0.5 pb-0.5">
                        {chat.title}
                    </p>
                    <TrashBinSvg
                        className={`w-[24px] h-[24px] flex-shrink-0 fill-red-600 ${chatId == chat.id ? "opacity-100" : "opacity-0"} group-hover:opacity-100 transition-opacity absolute right-2 bg-neutral-800 px-1`}
                        onClickCapture={(e) => handleShowDialog(e, chat.id)}
                    />
                </Link>
            ))}
        </div>
    );
};

export default CategoryChats;
