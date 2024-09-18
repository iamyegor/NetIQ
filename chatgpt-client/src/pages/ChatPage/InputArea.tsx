import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { FaRegStopCircle } from "react-icons/fa";
import { Send } from "lucide-react";
import React, { useEffect, useRef, useState } from "react";
import RotateRightSvg from "@/assets/pages/chat/rotate-right.svg?react";
import { useAppContext } from "@/context/AppContext.tsx";

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

    async function sendMessage() {
        if (!inputMessage.trim()) return;

        const url = chatId
            ? `https://localhost:7071/api/chats/${chatId}/messages`
            : `https://localhost:7071/api/chats/stream`;

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
        <div ref={containerRef} className="pt-2 pb-4 flex justify-center space-y-8 px-2 xs:px-5">
            <div className="w-full max-w-[800px] flex space-x-2 items-end">
                {appError ? (
                    <div className="w-full flex justify-center">
                        <Button className="p-6 space-x-3" onClick={handleReload}>
                            <RotateRightSvg className="w-5 h-5" />
                            <span>Перезагрузить чат</span>
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
                                placeholder="Напишите сообщение..."
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
                            {/*<p>{isStreaming ? "Stop" : "Send"}</p>*/}
                        </Button>
                    </>
                )}
            </div>
        </div>
    );
};

export default InputArea;
