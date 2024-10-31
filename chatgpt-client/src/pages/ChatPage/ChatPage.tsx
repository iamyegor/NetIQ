import ChatArea from "@/pages/ChatPage/ChatArea/ChatArea";
import GoDownButton from "@/pages/ChatPage/_ui/GoDownButton.tsx";
import Sidebar from "@/pages/ChatPage/Sidbar/Sidebar";
import Header from "@/pages/ChatPage/Header/Header.tsx";
import InputArea from "@/pages/ChatPage/InputArea/InputArea.tsx";

export default function ChatPage() {
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
}
