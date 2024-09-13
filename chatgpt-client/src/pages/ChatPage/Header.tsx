import { Button } from "@/components/ui/button.tsx";
import AddSvg from "@/assets/pages/chat/add.svg?react";
import { FiSidebar } from "react-icons/fi";
import React from "react";

const Header = ({
    isSidebarExpanded,
    toggleSidebar,
    createNewChat,
}: {
    isSidebarExpanded: boolean;
    toggleSidebar: () => void;
    createNewChat: () => void;
}) => (
    <header className="bg-neutral-800 w-full h-min p-4 shadow-sm">
        <div className="flex space-x-2 text-white fill-white">
            <Button
                onClick={toggleSidebar}
                variant="ghost"
                size="icon"
                className={`${isSidebarExpanded ? "!opacity-0" : "!opacity-100"} transition-opacity  duration-100`}
                disabled={isSidebarExpanded}
            >
                <FiSidebar className="h-6 w-6" />
            </Button>
            <Button
                onClick={createNewChat}
                variant="ghost"
                size="icon"
                className={`${isSidebarExpanded ? "!opacity-0" : "!opacity-100"} transition-opacity  duration-100`}
                disabled={isSidebarExpanded}
            >
                <AddSvg className="h-6 w-6" />
            </Button>
        </div>
    </header>
);

export default Header;
