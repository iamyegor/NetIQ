import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { FaRegStopCircle } from "react-icons/fa";
import { Send } from "lucide-react";
import React, { useEffect, useRef } from "react";

const InputArea = ({
    inputMessage,
    setInputMessage,
    sendMessage,
    isStreaming,
    stopStreaming,
    updateInputAreaHeight,
}: {
    inputMessage: string;
    setInputMessage: (message: string) => void;
    sendMessage: () => void;
    isStreaming: boolean;
    stopStreaming: () => void;
    updateInputAreaHeight: (height: number) => void;
}) => {
    const textareaRef = useRef<HTMLTextAreaElement>(null);
    const containerRef = useRef<HTMLDivElement>(null);

    const resizeTextarea = () => {
        if (textareaRef.current) {
            textareaRef.current.style.height = "auto";
            textareaRef.current.style.height = `${Math.max(textareaRef.current.scrollHeight, 57)}px`;

            if (containerRef.current) {
                updateInputAreaHeight(containerRef.current.offsetHeight);
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

    const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
        if (e.key === "Enter" && !e.shiftKey && !isStreaming) {
            e.preventDefault();
            sendMessage();
        }
    };

    return (
        <div ref={containerRef} className="pt-2 pb-4 flex justify-center space-y-8">
            <div className="w-full max-w-[800px] flex space-x-2 items-end">
                <div className="w-full bg-[#333333] pr-5 rounded-[35px] overflow-hidden">
                    <Textarea
                        ref={textareaRef}
                        className={`text-white pb-4.5 pl-5 !bg-[#333333] max-h-[250px] w-full focus-visible:outline-none  ${textareaRef.current?.scrollHeight && textareaRef.current.scrollHeight < 250 ? "scrollbar-hide" : ""}`}
                        value={inputMessage}
                        onChange={handleInputChange}
                        onKeyDown={handleKeyDown}
                        placeholder="Type a message..."
                        rows={1}
                        style={{ minHeight: "55px" }}
                    />
                </div>
                <Button
                    onClick={isStreaming ? stopStreaming : sendMessage}
                    className="space-x-2 h-[55px] !rounded-full"
                >
                    {isStreaming ? (
                        <FaRegStopCircle className="h-4 w-4" />
                    ) : (
                        <Send className="h-4 w-4" />
                    )}
                    <p>{isStreaming ? "Stop" : "Send"}</p>
                </Button>
            </div>
        </div>
    );
};

export default InputArea;
