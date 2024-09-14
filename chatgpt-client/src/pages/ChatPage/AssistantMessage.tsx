import { Message } from "@/pages/ChatPage/types.ts";
import React, { useMemo, useRef, useState } from "react";
import { useScalingDot } from "@/pages/hooks/useScalingDot.ts";
import Markdown from "react-markdown";
import CodeHighlight from "@/pages/ChatPage/CodeHighlight.tsx";
import ScalingDot from "@/pages/ChatPage/ScalingDot.tsx";
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from "@/components/ui/tooltip.tsx";
import BotSvg from "@/assets/pages/chat/user-robot.svg?react";
import CopySvg from "@/assets/pages/chat/copy.svg?react";
import RotateSvg from "@/assets/pages/chat/rotate.svg?react";
import CheckSvg from "@/assets/pages/chat/check.svg?react";
import VariantsPagination from "@/pages/ChatPage/VariantsPagination.tsx";

const AssistantMessage = ({
    message,
    isStreaming,
    isLast,
    variants,
    selectVariant,
    regenerateResponse,
}: {
    message: Message;
    isStreaming: boolean;
    isLast: boolean;
    variants: Message[];
    selectVariant: (message: Message) => void;
    regenerateResponse: () => void;
}) => {
    const [isCopied, setIsCopied] = useState(false);
    const contentRef = useRef<HTMLDivElement>(null);
    const scalingDotRef = useRef<HTMLDivElement>(null);

    function handleCopy() {
        navigator.clipboard.writeText(message.content);
        setIsCopied(true);

        setTimeout(() => {
            setIsCopied(false);
        }, 1000);
    }

    useScalingDot(contentRef, scalingDotRef, message, isStreaming, isLast);

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

        if (isLast && !isStreaming) {
            return true;
        }

        return false;
    }

    return (
        <div className="flex gap-x-3 justify-start">
            <div className="fill-white flex-shrink-0 w-9 h-9 rounded-full border border-neutral-600 p-1.5 mt-1.5">
                <BotSvg className="w-full h-full" />
            </div>
            <div className="p-3 rounded-[25px] text-white flex flex-col gap-y-5 w-full">
                <div ref={contentRef}>
                    {memoizedMarkdown}
                    <div
                        className={!message.content && isStreaming && isLast ? "visible" : "hidden"}
                    >
                        <ScalingDot ref={scalingDotRef} />
                    </div>
                </div>
                {showTools() && (
                    <div className="flex gap-x-4 text-sm">
                        {variants.length > 1 && (
                            <VariantsPagination
                                items={variants}
                                currentItem={message}
                                onSelectItem={selectVariant}
                            />
                        )}
                        <TooltipProvider delayDuration={100}>
                            <Tooltip>
                                <TooltipTrigger onClick={handleCopy}>
                                    {!isCopied ? (
                                        <CopySvg className="w-4 h-4 fill-neutral-300" />
                                    ) : (
                                        <CheckSvg className="w-4 h-4 fill-neutral-300" />
                                    )}
                                </TooltipTrigger>
                                <TooltipContent side="bottom">
                                    <p>Скопировать</p>
                                </TooltipContent>
                            </Tooltip>
                        </TooltipProvider>
                        <TooltipProvider delayDuration={100}>
                            <Tooltip>
                                <TooltipTrigger onClick={regenerateResponse}>
                                    <RotateSvg className="w-4 h-4 fill-neutral-300" />
                                </TooltipTrigger>
                                <TooltipContent side="bottom">
                                    <p>Пересоздать</p>
                                </TooltipContent>
                            </Tooltip>
                        </TooltipProvider>
                    </div>
                )}
            </div>
        </div>
    );
};

export default AssistantMessage;
