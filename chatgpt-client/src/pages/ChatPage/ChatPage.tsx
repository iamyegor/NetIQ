import { useAppContext } from "@/context/AppContext.tsx";
import ChatArea from "@/pages/ChatPage/ChatArea/ChatArea";
import GoDownButton from "@/pages/ChatPage/GoDownButton.tsx";
import Sidebar from "@/pages/ChatPage/Sidebar.tsx";
import Header from "@/pages/Header/Header";
import InputArea from "@/pages/InputArea/InputArea";
import { useEffect } from "react";

const ChatPage = () => {
    const { loadChats } = useAppContext();

    useEffect(() => {
        loadChats();
    }, []);
    
    return (
        <div className="flex h-screen bg-neutral-900 relative">
            <Sidebar />
            <div className="h-full w-full flex flex-col relative">
                <Header />
                <div className="block sm:hidden h-[70px] w-full"></div>
                <ChatArea />
                <InputArea />
                <GoDownButton />
            </div>
        </div>
    );
};

export default ChatPage;
