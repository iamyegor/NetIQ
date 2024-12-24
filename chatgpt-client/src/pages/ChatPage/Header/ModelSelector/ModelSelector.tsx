import DownArrowSvg from "@/assets/pages/chat/arrow-down.svg?react";
import BoltSvg from "@/assets/pages/chat/bolt.svg?react";
import BulbSvg from "@/assets/pages/chat/bulb.svg?react";
import { Checkbox } from "@/components/ui/checkbox.tsx";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu.tsx";
import useModelStore from "@/lib/zustand/model/useModelStore";
import useModelSelectorTranslation from "@/pages/ChatPage/Header/ModelSelector/_hooks/useModelSelectorTranslation.ts";
import useSubscription from "@/pages/ChatPage/Header/ModelSelector/_hooks/useSubscription";
import Model from "@/types/chat/Model.ts";
import { useEffect, useMemo } from "react";
import { useMediaQuery } from "react-responsive";
import { Link } from "react-router-dom";

export default function ModelSelector() {
    const { subscription } = useSubscription();
    const isMdScreen = useMediaQuery({ minWidth: 768 });
    const { selectedModel, setSelectedModel } = useModelStore();
    const t = useModelSelectorTranslation();

    const models: Model[] = useMemo(
        () => [
            {
                id: "gpt-4o",
                name: "GPT-4o",
                description: t.models["gpt-4o"].description,
                icon: BulbSvg,
                subscriptionAccess: ["plus"],
            },
            {
                id: "gpt-4o-mini",
                name: "GPT-4o mini",
                description: t.models["gpt-4o-mini"].description,
                icon: BoltSvg,
                subscriptionAccess: [],
            },
        ],
        [window.uiLanguage],
    );

    useEffect(() => {
        setSelectedModel(models[1]);
    }, [window.uiLanguage]);

    function handleModelSelect(e: Event, model: Model) {
        if (!isModelAccessible(model)) {
            e.preventDefault();
            return;
        }

        setSelectedModel(model);
    }

    function isModelAccessible(model: Model) {
        if (model.subscriptionAccess.length === 0) return true;
        return !!subscription && model.subscriptionAccess.includes(subscription);
    }

    return (
        <DropdownMenu>
            <DropdownMenuTrigger className="outline-none flex items-center space-x-2 px-3 p-2 hover:bg-neutral-700/50 transition font-semibold rounded-xl -mt-0.5">
                <span className="text-lg">{selectedModel?.name ?? t.selectModel}</span>
                <DownArrowSvg className="w-5 h-5" />
            </DropdownMenuTrigger>
            <DropdownMenuContent align={isMdScreen ? "start" : "center"}>
                <DropdownMenuLabel className="pl-4">{t.chooseModel}</DropdownMenuLabel>
                <DropdownMenuSeparator />
                {models.map((model) => (
                    <DropdownMenuItem
                        key={model.name}
                        className={`items-center justify-between !px-3 ${!isModelAccessible(model) ? "hover:!bg-neutral-950 !cursor-default" : ""} hover:!bg-neutral-800`}
                        onSelect={(e) => handleModelSelect(e, model)}
                    >
                        <div className="space-x-3 flex items-center">
                            <model.icon className="w-5 h-5 fill-white" />
                            <div className="space-y-1.5">
                                <p className="font-medium">{model.name}</p>
                                <p className="text-xs text-neutral-400">{model.description}</p>
                            </div>
                        </div>
                        {isModelAccessible(model) ? (
                            <Checkbox checked={selectedModel?.id === model.id} />
                        ) : (
                            <Link
                                to="/pricing"
                                className="w-min h-min p-1 px-2 text-xs rounded-lg bg-neutral-900 border border-neutral-700 hover:bg-neutral-950 transition"
                            >
                                {t.upgrade}
                            </Link>
                        )}
                    </DropdownMenuItem>
                ))}
            </DropdownMenuContent>
        </DropdownMenu>
    );
}
