import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Checkbox } from "@/components/ui/checkbox";
import DownArrowSvg from "@/assets/pages/chat/arrow-down.svg?react";
import { Model } from "@/pages/ChatPage/types.ts";
import { useMediaQuery } from "react-responsive";

export default function ModelSelector({
    selectedModel,
    models,
    handleModelSelect,
}: {
    selectedModel: Model | null;
    models: Model[];
    handleModelSelect: (model: Model) => void;
}) {
    const isMdScreen = useMediaQuery({ minWidth: 768 });

    return (
        <DropdownMenu>
            <DropdownMenuTrigger className="outline-none flex items-center space-x-2 px-3 p-2 hover:bg-neutral-700 transition font-semibold rounded-xl -mt-0.5">
                <span className="text-lg">{selectedModel?.name ?? "Выберите модель"}</span>
                <DownArrowSvg className="w-5 h-5" />
            </DropdownMenuTrigger>
            <DropdownMenuContent align={isMdScreen ? "start" : "center"}>
                <DropdownMenuLabel className="pl-4">Выбрать модель</DropdownMenuLabel>
                <DropdownMenuSeparator />
                {models.map((model) => (
                    <DropdownMenuItem
                        key={model.name}
                        className="items-center justify-between"
                        onSelect={() => handleModelSelect(model)}
                    >
                        <div className="space-x-3 flex items-center">
                            <model.icon className="w-5 h-5 fill-white" />
                            <div className="space-y-1.5">
                                <p className="font-medium">{model.name}</p>
                                <p className="text-xs text-neutral-400">{model.description}</p>
                            </div>
                        </div>
                        <Checkbox checked={selectedModel === model} />
                    </DropdownMenuItem>
                ))}
            </DropdownMenuContent>
        </DropdownMenu>
    );
}
