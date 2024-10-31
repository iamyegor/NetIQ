import CheckSvg from "@/assets/pages/chat/check.svg?react";
import CopySvg from "@/assets/pages/chat/copy.svg?react";
import shortenedLogo from "@/assets/pages/chat/netiq-shortened.png";
import RotateSvg from "@/assets/pages/chat/rotate.svg?react";
import ScalingDot from "@/components/ui/ScalingDot.tsx";
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from "@/components/ui/tooltip.tsx";
import VariantsPagination from "@/components/ui/VariantsPagination.tsx";
import { useRegenerateResponseAndStream } from "@/hooks/streaming/useRegenerateResponseAndStream.ts";
import useMessageStore from "@/lib/zustand/messages/useMessageStore.ts";
import useCalculateMessagesVariants from "@/pages/ChatPage/ChatArea/ChatMessage/_hooks/useCalculateMessagesVariants";
import useAppendScalingDotAtTheEnd from "@/pages/ChatPage/ChatArea/ChatMessage/AssistantMessage/_hooks/useAppendScalingDotAtTheEnd.ts";
import useAssistantMessageTranslation from "@/pages/ChatPage/ChatArea/ChatMessage/AssistantMessage/_hooks/useAssistantMessageTranslation.ts";
import MemoizedMarkdown from "@/pages/ChatPage/ChatArea/ChatMessage/AssistantMessage/_ui/MemoizedMarkdown/MemoizedMarkdown";
import Message from "@/types/chat/Message.ts";
import { useRef, useState } from "react";

export default function AssistantMessage({
    message,
    selectVariant,
}: {
    message: Message;
    selectVariant: (message: Message) => void;
}) {
    const [isCopied, setIsCopied] = useState(false);
    const contentRef = useRef<HTMLDivElement>(null);
    const scalingDotRef = useRef<HTMLDivElement>(null);

    const { isStreaming, displayedMessages } = useMessageStore();

    const { regenerateResponseAndStream } = useRegenerateResponseAndStream();
    const t = useAssistantMessageTranslation();
    const variants = useCalculateMessagesVariants(message);

    const isLast = displayedMessages[displayedMessages.length - 1]?.id === message.id;
    useAppendScalingDotAtTheEnd(contentRef, scalingDotRef, message, isStreaming, isLast);

    async function handleCopy() {
        await navigator.clipboard.writeText(message.content);
        setIsCopied(true);

        setTimeout(() => {
            setIsCopied(false);
        }, 1000);
    }

    function showTools() {
        if (!isLast) return true;

        return isLast && !isStreaming;
    }

    return (
        <div className="flex gap-x-1.5 md:gap-x-3 justify-start md:pr-7 group">
            <div className="fill-white flex-shrink-0 w-5 h-5 md:w-9 md:h-9 rounded-lg border border-neutral-700 p-[5px] md:p-[9px] mt-1.5 flex items-center">
                <img src={shortenedLogo} alt="ассистент" className="w-full" />
            </div>
            <div className="pl-3 pt-1 rounded-[25px] text-white flex flex-col gap-y-2.5 w-full">
                <div ref={contentRef}>
                    <MemoizedMarkdown content={message.content} />
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
                                addMarginRight
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
                                    onClick={() => regenerateResponseAndStream(message)}
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
