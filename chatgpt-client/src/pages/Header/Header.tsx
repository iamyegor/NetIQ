import netIqLogo from "@/assets/common/netiq.png";
import SideBarSvg from "@/assets/common/sidebar.svg?react";
import AddSvg from "@/assets/pages/chat/add.svg?react";
import BoltSvg from "@/assets/pages/chat/bolt.svg?react";
import BulbSvg from "@/assets/pages/chat/bulb.svg?react";
import { Button } from "@/components/ui/button";
import { useAppContext } from "@/context/AppContext.tsx";
import { Model } from "@/pages/ChatPage/types.ts";
import ModelSelector from "@/pages/ModelSelector/ModelSelector";
import { useEffect, useMemo } from "react";
import useModelTranslations from "./hooks/useModelTranslations";

const Header = () => {
    const {
        isSidebarExpanded,
        setIsSidebarExpanded,
        selectedModel,
        setSelectedModel,
        createNewChat,
    } = useAppContext();
    const t = useModelTranslations();

    const models: Model[] = useMemo(
        () => [
            {
                id: "gpt-4o",
                name: "GPT-4o",
                description: t["gpt-4o"].description,
                icon: BulbSvg,
                subscriptionAccess: ["plus"],
            },
            {
                id: "gpt-4o-mini",
                name: "GPT-4o mini",
                description: t["gpt-4o-mini"].description,
                icon: BoltSvg,
                subscriptionAccess: ["free", "plus"],
            },
        ],
        [window.uiLanguage],
    );

    useEffect(() => {
        setSelectedModel(models[1]);
    }, [window.uiLanguage]);

    const handleModelSelect = (modelId: Model) => {
        setSelectedModel(modelId);
    };

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
                <div className="absolute right-6">
                    <img
                        src={netIqLogo}
                        alt="Logo"
                        className="h-10 object-cover opacity-80 hover:opacity-70 cursor-pointer active:scale-95 transition"
                    />
                </div>
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
                    <SideBarSvg className="h-6 w-6" />
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
