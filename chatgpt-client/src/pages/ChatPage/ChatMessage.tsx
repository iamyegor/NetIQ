import { Message } from "@/pages/ChatPage/types.ts";
import React, { useRef, useState } from "react";
import BotSvg from "@/assets/pages/chat/user-robot.svg?react";
import CopySvg from "@/assets/pages/chat/copy.svg?react";
import RotateSvg from "@/assets/pages/chat/rotate.svg?react";
import CheckSvg from "@/assets/pages/chat/check.svg?react";
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from "@/components/ui/tooltip.tsx";
import PrevArrowSvg from "@/assets/pages/chat/prev-arrow.svg?react";
import NextArrowSvg from "@/assets/pages/chat/next-arrow.svg?react";
import Markdown from "react-markdown";
import ScalingDot from "@/pages/ChatPage/ScalingDot.tsx";
import CodeHighlight from "@/pages/ChatPage/CodeHighlight.tsx";
import { useScalingDot } from "@/pages/hooks/useScalingDot.ts";

const ChatMessage = ({
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

    return (
        <div className={`flex gap-x-3 justify-start`}>
            {message.sender === "assistant" && (
                <div className="fill-white flex-shrink-0 w-9 h-9 rounded-full border border-neutral-600 p-1.5 mt-1.5">
                    <BotSvg className="w-full h-full" />
                </div>
            )}
            <div
                className={`p-3 rounded-full text-white flex flex-col gap-y-5 ${
                    message.sender === "user"
                        ? "bg-neutral-700/50 ml-auto max-w-[70%] px-5"
                        : "w-full"
                }`}
                style={{ whiteSpace: "pre-wrap" }}
            >
                <div ref={contentRef}>
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
                    <div
                        className={!message.content && isStreaming && isLast ? "visible" : "hidden"}
                    >
                        <ScalingDot ref={scalingDotRef} />
                    </div>
                </div>
                {message.sender === "assistant" && (!isLast || !isStreaming) && (
                    <div className="flex gap-x-4 text-sm">
                        {variants.length > 1 && (
                            <div className="flex items-center space-x-2">
                                <button
                                    disabled={message === variants[0]}
                                    className="fill-neutral-300 hover:fill-neutral-100 disabled:fill-neutral-500"
                                    onClick={() =>
                                        selectVariant(variants[variants.indexOf(message) - 1])
                                    }
                                >
                                    <PrevArrowSvg className="w-3.5 h-3.5" />
                                </button>
                                <span>{variants.indexOf(message) + 1}</span>
                                <span>/</span>
                                <span>{variants.length}</span>
                                <button
                                    disabled={message === variants[variants.length - 1]}
                                    className="fill-neutral-300 hover:fill-neutral-100 disabled:fill-neutral-500"
                                    onClick={() =>
                                        selectVariant(variants[variants.indexOf(message) + 1])
                                    }
                                >
                                    <NextArrowSvg className="w-3.5 h-3.5" />
                                </button>
                            </div>
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

export default ChatMessage;
