import { Input } from "@/components/ui/input.tsx";
import { Button } from "@/components/ui/button.tsx";
import { FaRegStopCircle } from "react-icons/fa";
import { Send } from "lucide-react";
import React from "react";

const InputArea = ({
    inputMessage,
    setInputMessage,
    sendMessage,
    isStreaming,
    stopStreaming,
}: {
    inputMessage: string;
    setInputMessage: (message: string) => void;
    sendMessage: () => void;
    isStreaming: boolean;
    stopStreaming: () => void;
}) => (
    <footer className="pt-2 pb-8 flex justify-center">
        <div className="w-full max-w-[800px] flex space-x-2 items-center">
            <Input
                className="text-white !p-7 rounded-full !bg-neutral-700/70"
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                placeholder="Type a message..."
                onKeyDown={(e) => e.key === "Enter" && !isStreaming && sendMessage()}
            />
            <Button
                onClick={isStreaming ? stopStreaming : sendMessage}
                className="space-x-2 !py-[26px] !rounded-full"
            >
                {isStreaming ? (
                    <FaRegStopCircle className="h-4 w-4" />
                ) : (
                    <Send className="h-4 w-4" />
                )}
                <p>{isStreaming ? "Stop" : "Send"}</p>
            </Button>
        </div>
    </footer>
);

export default InputArea;
