import { useQuery } from "@tanstack/react-query";
import api from "@/lib/api.ts";
import { useEffect, useState } from "react";
import { Chat } from "@/pages/ChatPage/types.ts";

export default function useChats() {
    const [chats, setChats] = useState<Chat[]>([]);

    const { data: chatsData } = useQuery({
        queryKey: ["chats"],
        queryFn: () => api.get("chats"),
        gcTime: 0,
    });

    useEffect(() => {
        if (chatsData) {
            setChats(chatsData.data);
        }
    }, [chatsData]);

    return { chats, setChats };
}
