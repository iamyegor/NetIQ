import { Button } from "@/components/ui/button";
import AddSvg from "@/assets/pages/chat/add.svg?react";
import { FiSidebar } from "react-icons/fi";
import React, { useEffect } from "react";
import BulbSvg from "@/assets/pages/chat/bulb.svg?react";
import BoltSvg from "@/assets/pages/chat/bolt.svg?react";
import { Model } from "@/pages/ChatPage/types.ts";
import ModelSelector from "@/pages/ChatPage/ModelSelector.tsx";
import { useAppContext } from "@/context/AppContext.tsx";

const models: Model[] = [
    {
        id: "gpt-4o",
        name: "GPT-4o",
        description: "Самая умная модель",
        icon: BulbSvg,
        subscriptionAccess: ["plus"],
    },
    {
        id: "gpt-4o-mini",
        name: "GPT-4o mini",
        description: "Очень быстрая модель",
        icon: BoltSvg,
        subscriptionAccess: ["free", "plus"],
    },
];

const Header = () => {
    const {
        isSidebarExpanded,
        setIsSidebarExpanded,
        selectedModel,
        setSelectedModel,
        createNewChat,
    } = useAppContext();

    useEffect(() => {
        setSelectedModel(models[1]);
    }, []);

    const handleModelSelect = (modelId: Model) => {
        setSelectedModel(modelId);
    };

    return (
        <header className="bg-neutral-800 w-full h-min pb-2 md:pb-4 p-4 fill-faded text-faded fixed md:static z-50">
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
                            <FiSidebar className="h-6 w-6" />
                        </Button>
                        <Button
                            onClick={() => createNewChat()}
                            variant="ghost"
                            size="icon"
                            className={`transition-opacity duration-100`}
                            disabled={isSidebarExpanded}
                        >
                            <AddSvg className="h-6 w-6" />
                        </Button>
                    </div>
                )}
                <ModelSelector
                    selectedModel={selectedModel}
                    models={models}
                    setSelectedModel={handleModelSelect}
                />
            </div>
            <div className="flex md:hidden justify-between">
                <Button
                    onClick={() => setIsSidebarExpanded(true)}
                    variant="ghost"
                    size="icon"
                    className="transition-opacity duration-100"
                >
                    <FiSidebar className="h-6 w-6" />
                </Button>
                <ModelSelector
                    selectedModel={selectedModel}
                    models={models}
                    setSelectedModel={handleModelSelect}
                />
                <Button
                    onClick={createNewChat}
                    variant="ghost"
                    size="icon"
                    className="transition-opacity duration-100"
                >
                    <AddSvg className="h-6 w-6" />
                </Button>
            </div>
        </header>
    );
};

export default Header;
