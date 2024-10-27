// InputArea.tsx
import RotateRightSvg from "@/assets/pages/chat/rotate-right.svg?react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useAppContext } from "@/context/AppContext.tsx";
import useResizeInputAutomatically from "@/pages/InputArea/hooks/useResizeInputAutomatically";
import React, { useRef } from "react";
import { FaRegStopCircle } from "react-icons/fa";
import MagicWantSvg from "./assets/magic-wand.svg?react";
import useInputAreaTranslations from "./hooks/useInputAreaTranslations";
import SendSvg from "./assets/send.svg?react";

export default function InputArea() {
    const {
        chatId,
        isStreaming,
        stopEventSource,
        appError,
        startChatEventSource,
        scrollToBottom,
        inputMessage,
        setInputMessage,
    } = useAppContext();

    const duplicateTextArea = useRef<HTMLTextAreaElement>(null);
    const containerRef = useRef<HTMLDivElement>(null);
    const t = useInputAreaTranslations();
    const { textAreaHeight } = useResizeInputAutomatically({
        duplicateTextArea: duplicateTextArea.current,
        inputMessage,
    });
    const chatRef = useRef<HTMLTextAreaElement | null>(null);

    async function sendMessage() {
        if (!inputMessage.trim()) return;

        const url = chatId ? `chats/${chatId}/messages` : `chats/stream`;

        await startChatEventSource(url, chatId ?? null, inputMessage.trim());
        setInputMessage("");
        setTimeout(() => scrollToBottom({ scrollType: "smooth" }), 70);
    }

    const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        setInputMessage(e.target.value);
    };

    const handleKeyDown = async (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
        if (e.key === "Enter" && !e.shiftKey && !isStreaming) {
            e.preventDefault();
            await sendMessage();
        }
    };

    const handleReload = () => {
        window.location.reload();
    };

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
                                ref={chatRef}
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
                                style={{ width: chatRef.current?.offsetWidth }}
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
