import CheckSvg from "@/assets/pages/chat/check.svg?react";
import CopySvg from "@/assets/pages/chat/copy.svg?react";
import shortenedLogo from "@/assets/pages/chat/netiq-shortened.png";
import RotateSvg from "@/assets/pages/chat/rotate.svg?react";
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from "@/components/ui/tooltip.tsx";
import { useAppContext } from "@/context/AppContext.tsx";
import CodeHighlight from "@/pages/ChatPage/CodeHighlight/CodeHighlight";
import { useScalingDot } from "@/pages/ChatPage/hooks/useScalingDot.ts";
import ScalingDot from "@/pages/ChatPage/ScalingDot.tsx";
import { Message } from "@/pages/ChatPage/types.ts";
import VariantsPagination from "@/pages/ChatPage/VariantsPagination.tsx";
import { useMemo, useRef, useState } from "react";
import Markdown from "react-markdown";
import useAssistantMessageTranslation from "./hooks/useAssistantMessageTranslation";

export default function AssistantMessage({
    message,
    variants,
    selectVariant,
}: {
    message: Message;
    variants: Message[];
    selectVariant: (message: Message) => void;
}) {
    const [isCopied, setIsCopied] = useState(false);
    const contentRef = useRef<HTMLDivElement>(null);
    const scalingDotRef = useRef<HTMLDivElement>(null);
    const { isStreaming, displayedMessages, regenerateResponse } = useAppContext();
    const isLast = displayedMessages[displayedMessages.length - 1]?.id === message.id;
    useScalingDot(contentRef, scalingDotRef, message, isStreaming, isLast);
    const t = useAssistantMessageTranslation();

    function handleCopy() {
        navigator.clipboard.writeText(message.content);
        setIsCopied(true);

        setTimeout(() => {
            setIsCopied(false);
        }, 1000);
    }

    const memoizedMarkdown = useMemo(() => {
        return (
            <Markdown
                className="flex flex-col gap-y-5 markdown-content"
                components={{
                    code: ({ children, ...rest }) => (
                        <CodeHighlight {...rest}>{children}</CodeHighlight>
                    ),
                }}
            >
                {message.content}
            </Markdown>
        );
    }, [message.content]);

    function showTools() {
        if (!isLast) {
            return true;
        }

        return isLast && !isStreaming;
    }

    return (
        <div className="flex gap-x-1.5 md:gap-x-3 justify-start md:pr-7 group">
            <div className="fill-white flex-shrink-0 w-7 h-7 md:w-9 md:h-9 rounded-lg border border-neutral-700 p-[7px] md:p-[9px] mt-1.5 flex items-center">
                <img src={shortenedLogo} alt="ассистент" className="w-full" />
            </div>
            <div className="pl-3 pt-1 rounded-[25px] text-white flex flex-col gap-y-5 w-full">
                <div className="" ref={contentRef}>
                    {memoizedMarkdown}
                    <div
                        className={!message.content && isStreaming && isLast ? "visible" : "hidden"}
                    >
                        <ScalingDot ref={scalingDotRef} />
                    </div>
                </div>
                {showTools() && (
                    <div className="opacity-0 group-hover:opacity-100 flex text-sm bg-secondary border border-neutral-700 p-1 w-min transition-opacity duration-300 rounded-lg">
                        {variants.length > 1 && (
                            <VariantsPagination
                                items={variants}
                                currentItem={message}
                                onSelectItem={selectVariant}
                            />
                        )}
                        <TooltipProvider delayDuration={100}>
                            <Tooltip>
                                <TooltipTrigger
                                    onClick={handleCopy}
                                    className={`hover:bg-neutral-800 p-1.5 rounded-md ${variants.length > 1 ? "mr-1" : "mr-4"}`}
                                >
                                    {!isCopied ? (
                                        <CopySvg className="w-4 h-4 fill-neutral-300" />
                                    ) : (
                                        <CheckSvg className="w-4 h-4 fill-neutral-300" />
                                    )}
                                </TooltipTrigger>
                                <TooltipContent side="bottom">
                                    <p>{t.copy}</p>
                                </TooltipContent>
                            </Tooltip>
                        </TooltipProvider>
                        <TooltipProvider delayDuration={100}>
                            <Tooltip>
                                <TooltipTrigger
                                    onClick={() => regenerateResponse(message.id)}
                                    className="hover:bg-neutral-800 p-1.5 rounded-md"
                                >
                                    <RotateSvg className="w-4 h-4 fill-neutral-300" />
                                </TooltipTrigger>
                                <TooltipContent side="bottom">
                                    <p>{t.regenerate}</p>
                                </TooltipContent>
                            </Tooltip>
                        </TooltipProvider>
                    </div>
                )}
            </div>
        </div>
    );
}
