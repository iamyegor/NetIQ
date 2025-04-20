import useMessageStore from "@/lib/zustand/messages/useMessageStore";
import { useRef, useEffect } from "react";
import { useParams } from "react-router-dom";

export default function useClearCodeMap() {
    const { chatId } = useParams();
    const prevChatId = useRef<string>(null);
    const { codeMap } = useMessageStore();

    useEffect(() => {
        if (prevChatId.current !== chatId) {
            codeMap.clear();
        }
    }, [chatId]);
}
