import netIqLogo from "@/assets/common/netiq.png";
import SideBarSvg from "@/assets/common/sidebar.svg?react";
import AddSvg from "@/assets/pages/chat/add.svg?react";
import { Button } from "@/components/ui/button.tsx";
import useUiStore from "@/lib/zustand/ui/useUiStore.ts";
import useCreateNewChat from "@/pages/ChatPage/Header/_hooks/useCreateNewChat";
import ModelSelector from "@/pages/ChatPage/Header/ModelSelector/ModelSelector.tsx";
import { useParams } from "react-router-dom";

export default function Header() {
    const { isSidebarExpanded, setIsSidebarExpanded } = useUiStore();
    const { chatId } = useParams();
    const { createNewChat } = useCreateNewChat();

    function handleCreateNewChat() {
        if (chatId) {
            createNewChat();
        }
    }

    return (
        <header className="bg-neutral-900 w-full h-min pb-2 md:pb-4 p-4 fill-faded text-faded fixed md:static z-50">
            <div className="hidden md:flex space-x-2">
                {!isSidebarExpanded && (
                    <div className="space-x-2 flex">
                        <Button
                            onClick={() => setIsSidebarExpanded(true)}
                            variant="ghost"
                            size="icon"
                            className={`transition-opacity duration-100`}
                            disabled={isSidebarExpanded}
                        >
                            <SideBarSvg className="h-6 w-6" />
                        </Button>
                        <Button
                            onClick={handleCreateNewChat}
                            variant="ghost"
                            size="icon"
                            className={`transition-opacity duration-100`}
                            disabled={isSidebarExpanded}
                        >
                            <AddSvg className="h-6 w-6" />
                        </Button>
                    </div>
                )}
                <div className="absolute right-6">
                    <img
                        src={netIqLogo}
                        alt="Logo"
                        className="h-10 object-cover opacity-80 hover:opacity-70 cursor-pointer active:scale-95 transition"
                    />
                </div>
                <ModelSelector />
            </div>
            <div className="flex md:hidden justify-between">
                <Button
                    onClick={() => setIsSidebarExpanded(true)}
                    variant="ghost"
                    size="icon"
                    className="transition-opacity duration-100"
                >
                    <SideBarSvg className="h-6 w-6" />
                </Button>
                <ModelSelector />
                <Button
                    onClick={handleCreateNewChat}
                    variant="ghost"
                    size="icon"
                    className="transition-opacity duration-100"
                >
                    <AddSvg className="h-6 w-6" />
                </Button>
            </div>
        </header>
    );
}
