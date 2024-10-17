import { useNavigate } from "react-router-dom";
import { Dispatch, SetStateAction } from "react";
import { AppError, Message } from "@/pages/ChatPage/types.ts";

export default function useCreateNewChat(
    setMessages: Dispatch<SetStateAction<Message[]>>,
    stopEventSource: () => void,
    setAppError: Dispatch<SetStateAction<AppError>>,
) {
    const navigate = useNavigate();

    function createNewChat() {
        navigate("/chat");
        setMessages([]);
        setAppError(null);
        stopEventSource();
    }

    return { createNewChat };
}
