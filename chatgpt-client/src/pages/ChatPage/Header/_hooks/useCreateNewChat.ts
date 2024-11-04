import useErrorStore from "@/lib/zustand/error/useModelStore";
import useEventSourceStore from "@/lib/zustand/evenSource/useEventSourceStore";
import useMessageStore from "@/lib/zustand/messages/useMessageStore";
import { useNavigate } from "react-router-dom";

export default function useCreateNewChat() {
    const { setMessages } = useMessageStore();
    const { stopEventSource } = useEventSourceStore();
    const { setAppError } = useErrorStore();
    const { setInputMessage } = useMessageStore();

    const navigate = useNavigate();

    function createNewChat() {
        navigate("/chat");
        setMessages([]);
        setInputMessage("");
        setAppError(null);
        stopEventSource();
    }

    return { createNewChat };
}
