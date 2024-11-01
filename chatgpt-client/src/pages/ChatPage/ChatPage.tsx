import ChatArea from "@/pages/ChatPage/ChatArea/ChatArea";
import GoDownButton from "@/pages/ChatPage/_ui/GoDownButton.tsx";
import Sidebar from "@/pages/ChatPage/Sidbar/Sidebar";
import Header from "@/pages/ChatPage/Header/Header.tsx";
import InputArea from "@/pages/ChatPage/InputArea/InputArea.tsx";
import SwipeDetector from "@/components/ui/SwipeDetector";

export default function ChatPage() {
    return (
        <div className="flex h-screen bg-neutral-900 relative">
            <Sidebar />
            <div className="h-full w-full flex flex-col relative">
                <Header />
                <div className="block md:hidden h-[90px] w-full"></div>
                <SwipeDetector>
                    <ChatArea />
                </SwipeDetector>
                <InputArea />
                <GoDownButton />
            </div>
        </div>
    );
}
