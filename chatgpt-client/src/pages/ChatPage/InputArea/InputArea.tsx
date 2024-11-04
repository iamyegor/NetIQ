import RotateRightSvg from "@/assets/pages/chat/rotate-right.svg?react";
import { Button } from "@/components/ui/button.tsx";
import { Textarea } from "@/components/ui/textarea.tsx";
import useSendPromptAndStreamChat from "@/hooks/streaming/useSendPromptAndStreamChat.ts";
import useErrorStore from "@/lib/zustand/error/useModelStore.ts";
import useEventSourceStore from "@/lib/zustand/evenSource/useEventSourceStore.ts";
import useMessageStore from "@/lib/zustand/messages/useMessageStore.ts";
import useUiStore from "@/lib/zustand/ui/useUiStore.ts";
import useResizeInputAutomatically from "@/pages/ChatPage/InputArea/_hooks/useResizeInputAutomatically.ts";
import React, { useRef, useState } from "react";
import { FaRegStopCircle } from "react-icons/fa";
import { useParams } from "react-router-dom";
import MagicWantSvg from "@/pages/ChatPage/InputArea/_assets/magic-wand.svg?react";
import SendSvg from "@/pages/ChatPage/InputArea/_assets/send.svg?react";
import useInputAreaTranslations from "@/pages/ChatPage/InputArea/_hooks/useInputAreaTranslations.ts";
import useScrollToBottomOnMessageSend from "@/pages/ChatPage/InputArea/_hooks/useScrollToBottomOnMessageSend.ts";

export default function InputArea() {
    const duplicateTextArea = useRef<HTMLTextAreaElement>(null);
    const containerRef = useRef<HTMLDivElement>(null);
    const inputRef = useRef<HTMLTextAreaElement | null>(null);
    const [isPromptSent, setIsPromptSent] = useState(false);

    const { setPromptWasSentLessThan100MsAgo } = useUiStore();
    const { inputMessage, setInputMessage } = useMessageStore();
    const { appError } = useErrorStore();
    const { isStreaming } = useMessageStore();
    const { stopEventSource } = useEventSourceStore();

    const { chatId } = useParams();
    const { sendPromptAndStreamChat } = useSendPromptAndStreamChat();
    const t = useInputAreaTranslations();
    const { textAreaHeight } = useResizeInputAutomatically({
        duplicateTextArea: duplicateTextArea.current,
        inputMessage,
    });

    useScrollToBottomOnMessageSend({ isPromptSent, setIsPromptSent });

    async function sendMessage() {
        if (!inputMessage.trim()) return;

        await sendPromptAndStreamChat(chatId ?? null, inputMessage.trim());
        setInputMessage("");

        setIsPromptSent(true);
        setPromptWasSentLessThan100MsAgo(true);
        setTimeout(() => setPromptWasSentLessThan100MsAgo(false), 100);
    }

    function handleInputChange(e: React.ChangeEvent<HTMLTextAreaElement>) {
        setInputMessage(e.target.value);
    }

    async function handleKeyDown(e: React.KeyboardEvent<HTMLTextAreaElement>) {
        if (e.key === "Enter" && !e.shiftKey && !isStreaming) {
            e.preventDefault();
            await sendMessage();
        }
    }

    function handleReload() {
        window.location.reload();
    }

    return (
        <div
            ref={containerRef}
            className="flex flex-col items-center px-2 xs:px-5 bottom-0 left-0 right-0 bg-neutral-900 fixed md:static"
        >
            <div className="w-full max-w-[800px] flex space-x-2 items-end mb-2">
                {appError ? (
                    <div className="w-full flex justify-center">
                        <Button className="p-6 space-x-3" onClick={handleReload}>
                            <RotateRightSvg className="w-5 h-5" />
                            <span>{t.reloadChat}</span>
                        </Button>
                    </div>
                ) : (
                    <div className="flex items-end justify-between w-full bg-secondary border border-neutral-800 rounded-2xl pb-3 pr-2">
                        <div className="w-full flex pl-5 items-top pt-3 pr-2 overflow-hidden">
                            <div className="pt-2.5">
                                <MagicWantSvg className="w-5 h-5 fill-gray-200" />
                            </div>
                            <Textarea
                                ref={inputRef}
                                className={`text-white min-h-[30px] mt-2 !bg-secondary max-h-[250px] w-full outline-none ${textAreaHeight < 250 ? "scrollbar-hide" : ""} transition-all`}
                                value={inputMessage}
                                onChange={handleInputChange}
                                onKeyDown={handleKeyDown}
                                placeholder={t.writeMessage}
                                style={{ height: textAreaHeight }}
                                rows={1}
                            />
                            <Textarea
                                ref={duplicateTextArea}
                                className="absolute -left-[9999px] opacity-0 min-h-[30px] mt-2 !bg-secondary max-h-[250px] w-full outline-none"
                                value={inputMessage}
                                style={{ width: inputRef.current?.offsetWidth }}
                                readOnly
                                rows={1}
                            />
                        </div>
                        <Button
                            onClick={isStreaming ? stopEventSource : sendMessage}
                            size="icon"
                            variant="ghost"
                        >
                            {isStreaming ? (
                                <FaRegStopCircle className="h-[18px] w-[18px] text-white" />
                            ) : (
                                <SendSvg className="h-[18px] w-[18px] fill-white" />
                            )}
                        </Button>
                    </div>
                )}
            </div>
            <p className="mb-2 text-neutral-400 text-[14px] font-medium space-x-1">
                <span>{t.developer.title}</span>
                <a
                    className="font-notable font-bold hover:text-white transition-colors cursor-pointer"
                    href={t.developer.link}
                    target="_blank"
                >
                    {t.developer.name}
                </a>
            </p>
        </div>
    );
}
