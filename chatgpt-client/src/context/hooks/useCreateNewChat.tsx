import { useNavigate } from "react-router-dom";
import { Dispatch, SetStateAction } from "react";
import { Message } from "@/pages/ChatPage/types.ts";

export default function useCreateNewChat(
    setMessages: Dispatch<SetStateAction<Message[]>>,
    stopEventSource: () => void,
) {
    const navigate = useNavigate();

    function createNewChat() {
        navigate("/chat");
        setMessages([]);
        stopEventSource();
    }

    return { createNewChat };
}
