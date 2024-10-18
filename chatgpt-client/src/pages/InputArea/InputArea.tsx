// InputArea.tsx
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { FaRegStopCircle } from "react-icons/fa";
import { Send } from "lucide-react";
import React, { useEffect, useRef, useState } from "react";
import RotateRightSvg from "@/assets/pages/chat/rotate-right.svg?react";
import { useAppContext } from "@/context/AppContext.tsx";
import useInputAreaTranslations from "./hooks/useInputAreaTranslations";

const InputArea = () => {
    const [inputMessage, setInputMessage] = useState("");
    const {
        chatId,
        isStreaming,
        stopEventSource,
        setInputAreaHeight,
        appError,
        startChatEventSource,
        scrollToBottom,
    } = useAppContext();

    const textareaRef = useRef<HTMLTextAreaElement>(null);
    const containerRef = useRef<HTMLDivElement>(null);
    const t = useInputAreaTranslations();

    async function sendMessage() {
        if (!inputMessage.trim()) return;

        const url = chatId ? `chats/${chatId}/messages` : `chats/stream`;

        await startChatEventSource(url, chatId ?? null, inputMessage.trim());
        setInputMessage("");
        setTimeout(() => scrollToBottom(true), 70);
    }

    const resizeTextarea = () => {
        if (textareaRef.current) {
            textareaRef.current.style.height = "auto";
            textareaRef.current.style.height = `${Math.max(textareaRef.current.scrollHeight, 57)}px`;

            if (containerRef.current) {
                setInputAreaHeight(containerRef.current.offsetHeight);
            }
        }
    };

    useEffect(() => {
        resizeTextarea();
    }, [inputMessage]);

    const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        setInputMessage(e.target.value);
        resizeTextarea();
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
            className="flex flex-col items-center px-2 xs:px-5 bottom-0 left-0 right-0 bg-neutral-800 fixed md:static"
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
                    <>
                        <div className="w-full bg-[#333333] pr-5 rounded-[35px] overflow-hidden">
                            <Textarea
                                ref={textareaRef}
                                className={`text-white pb-4.5 pl-5 !bg-[#333333] max-h-[250px] w-full focus-visible:outline-none  ${textareaRef.current?.scrollHeight && textareaRef.current.scrollHeight < 250 ? "scrollbar-hide" : ""}`}
                                value={inputMessage}
                                onChange={handleInputChange}
                                onKeyDown={handleKeyDown}
                                placeholder={t.writeMessage}
                                rows={1}
                                style={{ minHeight: "55px" }}
                            />
                        </div>
                        <Button
                            onClick={isStreaming ? stopEventSource : sendMessage}
                            className="space-x-2 h-[55px] !w-[57px] !rounded-full flex-shrink-0"
                        >
                            {isStreaming ? (
                                <FaRegStopCircle className="h-[18px] w-[18px] " />
                            ) : (
                                <Send className="h-[18px] w-[18px] " />
                            )}
                        </Button>
                    </>
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
};

export default InputArea;
