// SidebarContents.tsx
import AddSvg from "@/assets/pages/chat/add.svg?react";
import { Button } from "@/components/ui/button.tsx";
import { FiSidebar } from "react-icons/fi";
import CategoryChats from "@/pages/ChatPage/CategoryChats/CategoryChats";
import BaseSkeleton from "@/components/ui/BaseSkeleton.tsx";
import { Chat } from "@/pages/ChatPage/types.ts";
import { CircleUser, LogOut, Sparkles } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import api from "@/lib/api.ts";
import authApi from "@/lib/authApi.ts";
import { Link, useNavigate } from "react-router-dom";
import { useAppContext } from "@/context/AppContext.tsx";
import useSidebarTranslations from "./hooks/useSidebarTranslations";

async function fetchEmail() {
    const response = await api.get<{ email: string }>("user/email");
    return response.data;
}

export default function SidebarContents({
    categorizedChats,
}: {
    categorizedChats: {
        today: Chat[];
        yesterday: Chat[];
        previousSevenDays: Chat[];
        previousThirtyDays: Chat[];
    };
}) {
    const {
        isSidebarExpanded,
        setIsSidebarExpanded,
        chatsLoading,
        chatsEndRef,
        allChatsLoaded,
        createNewChat,
        isMdScreen,
    } = useAppContext();

    const { data } = useQuery({
        queryKey: ["email"],
        queryFn: () => fetchEmail(),
    });
    const navigate = useNavigate();
    const t = useSidebarTranslations();

    const email = data?.email ?? null;

    async function logout() {
        await authApi.post("auth/log-out");
        navigate("/sign-in");
    }

    function handleCreateNewChat() {
        createNewChat();
        if (!isMdScreen) {
            setIsSidebarExpanded(false);
        }
    }

    return (
        <div
            className={`bg-neutral-900 ${
                isSidebarExpanded ? "w-72" : "w-0"
            } h-screen transition-all overflow-hidden flex flex-col relative`}
        >
            <div className="overflow-y-scroll overflow-x-hidden mb-[125px]">
                <div className="p-2.5 py-4 pb-0 space-y-4">
                    <div className="flex flex-col gap-y-4 text-faded">
                        <Button
                            onClick={() => setIsSidebarExpanded(false)}
                            variant="ghost"
                            size="icon"
                        >
                            <FiSidebar className="h-6 w-6" />
                        </Button>
                        <Button
                            onClick={() => handleCreateNewChat()}
                            className="flex gap-x-3 min-w-[262px]"
                        >
                            <AddSvg className="h-6 w-6" />
                            <p>{t.newChat}</p>
                        </Button>
                    </div>
                    <div className="space-y-1 w-full">
                        {chatsLoading && (
                            <div className="flex -full  mt-12">
                                <BaseSkeleton className="w-full h-9" count={22} />
                            </div>
                        )}
                        <CategoryChats categoryTitle={t.today} chats={categorizedChats.today} />
                        <CategoryChats
                            categoryTitle={t.yesterday}
                            chats={categorizedChats.yesterday}
                        />
                        <CategoryChats
                            categoryTitle={t.lastSevenDays}
                            chats={categorizedChats.previousSevenDays}
                        />
                        <CategoryChats
                            categoryTitle={t.lastThirtyDays}
                            chats={categorizedChats.previousThirtyDays}
                        />
                        <div ref={chatsEndRef} className="flex justify-center">
                            {!chatsLoading && !allChatsLoaded && (
                                <l-ring-2 color="#e5e5e5" size="25" stroke="4"></l-ring-2>
                            )}
                        </div>
                    </div>
                </div>
            </div>
            <div className="absolute bottom-0 left-0 right-0 bg-neutral-900 p-2 pt-1.5 space-y-2">
                <Link
                    to="/pricing"
                    className="hover:bg-neutral-800 rounded-xl flex items-center space-x-3 text-white px-2 text-sm cursor-pointer h-[50px] transition duration-300"
                >
                    <Sparkles className="w-6 h-6 flex-shrink-0" />
                    <div className="text-nowrap">
                        <p>{t.upgradePlan}</p>
                        <p className="text-xs text-neutral-400">{t.getMoreFeatures}</p>
                    </div>
                </Link>
                <div className="bg-neutral-800 rounded-xl px-2 flex items-center justify-between text-white h-[50px]">
                    <div className="flex items-center space-x-3">
                        <CircleUser className="w-6 h-6" />
                        <p className="text-sm truncate max-w-[21ch]">{email ?? t.profile}</p>
                    </div>
                    <Button
                        size="icon"
                        variant="ghost"
                        className="!w-8 !h-8 flex-shrink-0"
                        onClick={() => logout()}
                    >
                        <LogOut className="w-5 h-5 text-red-500" />
                    </Button>
                </div>
            </div>
        </div>
    );
}
