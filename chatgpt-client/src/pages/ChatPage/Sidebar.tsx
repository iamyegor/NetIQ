import React, { useMemo } from "react";
import { Chat } from "@/pages/ChatPage/types.ts";
import SidebarContents from "@/pages/ChatPage/SidebarContents.tsx";
import { Drawer, DrawerContent, DrawerHeader, DrawerTitle } from "@/components/ui/drawer";
import { useMediaQuery } from "react-responsive";
import { DialogDescription } from "@/components/ui/dialog.tsx";
import { useAppContext } from "@/context/AppContext.tsx";

const Sidebar = () => {
    const { isSidebarExpanded, setIsSidebarExpanded, chats } = useAppContext();

    const isMdScreen = useMediaQuery({ minWidth: 768 });

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
            {isMdScreen ? (
                <SidebarContents categorizedChats={categorizedChats} />
            ) : (
                <Drawer
                    open={isSidebarExpanded}
                    onOpenChange={() => setIsSidebarExpanded((prev) => !prev)}
                    direction="left"
                >
                    <DrawerHeader className="absolute -top-999 -left-999">
                        <DrawerTitle>Навигация по чатам</DrawerTitle>
                        <DialogDescription>Чаты</DialogDescription>
                    </DrawerHeader>
                    <DrawerContent className="h-screen top-0 left-0 right-auto mt-0 w-min rounded-none text-white">
                        <SidebarContents categorizedChats={categorizedChats} />
                    </DrawerContent>
                </Drawer>
            )}
        </aside>
    );
};

export default Sidebar;
