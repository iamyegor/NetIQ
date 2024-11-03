import useErrorStore from "@/lib/zustand/error/useModelStore";
import useEventSourceStore from "@/lib/zustand/evenSource/useEventSourceStore";
import useMessageStore from "@/lib/zustand/messages/useMessageStore";
import { useNavigate } from "react-router-dom";
import useChatUiStore from "@/lib/zustand/chatsUi/useChatsUiStore.ts";

export default function useCreateNewChat() {
    const { setMessages } = useMessageStore();
    const { stopEventSource } = useEventSourceStore();
    const { setAppError } = useErrorStore();
    const { setChatHeight } = useChatUiStore();
    const navigate = useNavigate();

    function createNewChat() {
        navigate("/chat");
        setMessages([]);
        setChatHeight(0);
        setAppError(null);
        stopEventSource();
    }

    return { createNewChat };
}
