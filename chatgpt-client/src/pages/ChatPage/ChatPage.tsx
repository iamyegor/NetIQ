import React, { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Message } from "@/pages/ChatPage/types.ts";
import ChatArea from "@/pages/ChatPage/ChatArea.tsx";
import InputArea from "@/pages/ChatPage/InputArea.tsx";
import Header from "@/pages/ChatPage/Header.tsx";
import Sidebar from "@/pages/ChatPage/Sidebar.tsx";
import useDisplayedMessages from "@/pages/hooks/useDisplayedMessages.ts";
import useChatEventSource from "@/pages/hooks/useChatEventSource.ts";
import useScrollToBottom from "@/pages/hooks/useScrollToBottom.ts";
import useChats from "@/pages/hooks/useChats.ts";
import { useBaseEventSource } from "@/pages/hooks/useBaseEventSource.ts";
import { useRegenerateResponse } from "@/pages/hooks/useRegenerateResponse.ts";
import GoDownButton from "@/pages/ChatPage/GoDownButton.tsx";
import useEditPrompt from "@/pages/hooks/useEditPrompt.ts";

const ChatPage = () => {
    const [isSidebarExpanded, setIsSidebarExpanded] = useState(false);
    const [messages, setMessages] = useState<Message[]>([]);
    const [inputMessage, setInputMessage] = useState("");
    const [isStreaming, setIsStreaming] = useState(false);
    const [shouldAttachToBottom, setShouldAttachToBottom] = useState(false);
    const [canShowScrollButton, setCanShowScrollButton] = useState(true);
    const displayedMessages = useDisplayedMessages(messages);
    const scrollToBottom = useScrollToBottom(setCanShowScrollButton, setShouldAttachToBottom);
    const [hasChatScrollbar, setHasChatScrollbar] = useState(false);
    const { chats, setChats } = useChats();
    const { startEventSource, stopEventSource } = useBaseEventSource(setIsStreaming);
    const { startChatEventSource } = useChatEventSource(
        displayedMessages,
        setIsStreaming,
        setMessages,
        setChats,
        startEventSource,
    );
    const regenerateResponse = useRegenerateResponse(
        setMessages,
        displayedMessages,
        setIsStreaming,
        startEventSource,
    );
    const editPrompt = useEditPrompt(
        displayedMessages,
        setMessages,
        setIsStreaming,
        startEventSource,
    );

    const [inputAreaHeight, setInputAreaHeight] = useState(0);

    const navigate = useNavigate();
    const { chatId } = useParams<{ chatId: string }>();

    function toggleSidebar() {
        setIsSidebarExpanded(!isSidebarExpanded);
    }

    function clearChat() {
        navigate("/chat");
        setMessages([]);
    }

    function sendMessage() {
        if (!inputMessage.trim()) return;

        const url = chatId
            ? `https://localhost:7071/api/chats/${chatId}/messages/stream`
            : `https://localhost:7071/api/chats/stream`;

        startChatEventSource(url, chatId ?? null, inputMessage.trim());
        setInputMessage("");
        setTimeout(() => scrollToBottom(true), 70);
    }

    const updateInputAreaHeight = (height: number) => {
        setInputAreaHeight(height);
    };

    return (
        <div className="flex h-screen bg-neutral-800 relative ">
            <Sidebar
                isSidebarExpanded={isSidebarExpanded}
                toggleSidebar={toggleSidebar}
                createNewChat={clearChat}
                chats={chats}
                currentChatId={chatId || null}
                setCurrentChatId={(id) => navigate(`/chats/${id}`)}
            />
            <div className="h-full w-full flex flex-col relative">
                <Header
                    isSidebarExpanded={isSidebarExpanded}
                    toggleSidebar={toggleSidebar}
                    createNewChat={clearChat}
                />
                <ChatArea
                    messages={messages}
                    setMessages={setMessages}
                    displayedMessages={displayedMessages}
                    isStreaming={isStreaming}
                    regenerateResponse={regenerateResponse}
                    setHasChatScrollbar={setHasChatScrollbar}
                    shouldAttachToBottom={shouldAttachToBottom}
                    setShouldAttachToBottom={setShouldAttachToBottom}
                    scrollToBottom={scrollToBottom}
                    editPrompt={editPrompt}
                />
                <InputArea
                    inputMessage={inputMessage}
                    setInputMessage={setInputMessage}
                    sendMessage={sendMessage}
                    isStreaming={isStreaming}
                    stopStreaming={stopEventSource}
                    updateInputAreaHeight={updateInputAreaHeight}
                />
                {!shouldAttachToBottom && canShowScrollButton && hasChatScrollbar && (
                    <GoDownButton
                        onClick={() => scrollToBottom(true)}
                        bottom={inputAreaHeight + 15}
                    />
                )}
            </div>
        </div>
    );
};

export default ChatPage;
