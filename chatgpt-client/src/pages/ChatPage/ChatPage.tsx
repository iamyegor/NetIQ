import React, { useEffect } from "react";
import ChatArea from "@/pages/ChatPage/ChatArea.tsx";
import InputArea from "@/pages/ChatPage/InputArea.tsx";
import Header from "@/pages/ChatPage/Header.tsx";
import Sidebar from "@/pages/ChatPage/Sidebar.tsx";
import GoDownButton from "@/pages/ChatPage/GoDownButton.tsx";
import { useAppContext } from "@/context/AppContext.tsx";

const ChatPage = () => {
    const { loadChats } = useAppContext();

    useEffect(() => {
        loadChats();
    }, []);
    
    return (
        <div className="flex h-screen bg-neutral-800 relative">
            <Sidebar />
            <div className="h-full w-full flex flex-col relative">
                <Header />
                <ChatArea />
                <InputArea />
                <GoDownButton />
            </div>
        </div>
    );
};

export default ChatPage;
