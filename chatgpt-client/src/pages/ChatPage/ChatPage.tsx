import ChatArea from "@/pages/ChatPage/ChatArea/ChatArea";
import GoDownButton from "@/pages/ChatPage/_ui/GoDownButton.tsx";
import Sidebar from "@/pages/ChatPage/Sidbar/Sidebar";
import Header from "@/pages/ChatPage/Header/Header.tsx";
import InputArea from "@/pages/ChatPage/InputArea/InputArea.tsx";
import SwipeDetector from "@/components/ui/SwipeDetector";

export default function ChatPage() {
    return (
        <div className="flex w-full h-[100dvh] bg-neutral-900 relative overflow-y-auto">
            <Sidebar />
            <div className="w-full h-full flex flex-col relative">
                <Header />
                <SwipeDetector>
                    <ChatArea />
                </SwipeDetector>
                <InputArea />
                <GoDownButton />
            </div>
        </div>
    );
}
