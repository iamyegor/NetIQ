import useCreateNewChat from "@/context/hooks/useCreateNewChat.tsx";
import useError from "@/context/hooks/useError.ts";
import { useBaseEventSource } from "@/pages/ChatPage/hooks/useBaseEventSource.ts";
import useChatEventSource from "@/pages/ChatPage/hooks/useChatEventSource.ts";
import useChats from "@/pages/ChatPage/hooks/useChats.ts";
import useDisplayedMessages from "@/pages/ChatPage/hooks/useDisplayedMessages.ts";
import useEditPrompt from "@/pages/ChatPage/hooks/useEditPrompt.ts";
import { useRegenerateResponse } from "@/pages/ChatPage/hooks/useRegenerateResponse.ts";
import { ScrollType } from "@/pages/ChatPage/hooks/useScrollToBottom";
import useScrollToBottom from "@/pages/ChatPage/hooks/useScrollToBottom.ts";
import { AppError, Chat, Message, Model } from "@/pages/ChatPage/types.ts";
import React, {
    createContext,
    Dispatch,
    ReactNode,
    SetStateAction,
    useContext,
    useState,
} from "react";
import { useMediaQuery } from "react-responsive";
import { useParams } from "react-router-dom";
import useLanguageDetection, { Language } from "./hooks/useLanguageDetection";

interface AppContextValue {
    messages: Message[];
    setMessages: Dispatch<SetStateAction<Message[]>>;
    startEventSource: (url: string, body: any, onMessage: (event: MessageEvent) => void) => void;
    stopEventSource: () => void;
    isStreaming: boolean;
    setIsStreaming: Dispatch<SetStateAction<boolean>>;
    appError: AppError;
    setAppError: Dispatch<SetStateAction<AppError>>;
    chatId: string | undefined;
    displayedMessages: Message[];
    selectedModel: Model | null;
    setSelectedModel: Dispatch<SetStateAction<Model | null>>;
    inputAreaHeight: number;
    setInputContainerHeight: Dispatch<SetStateAction<number>>;
    canShowGoDownButton: boolean;
    setCanShowGoDownButton: Dispatch<SetStateAction<boolean>>;
    shouldAttachToBottom: boolean;
    setShouldAttachToBottom: Dispatch<SetStateAction<boolean>>;
    scrollToBottom: ({ scrollType }?: { scrollType?: ScrollType }) => void;
    hasChatScrollbar: boolean;
    setHasChatScrollbar: Dispatch<SetStateAction<boolean>>;
    chats: Chat[];
    chatsLoading: boolean;
    startChatEventSource: (
        url: string,
        chatId: string | null,
        messageContent: string,
    ) => Promise<void>;
    chatsEndRef: (node?: Element | null) => void;
    allChatsLoaded: boolean;
    isSidebarExpanded: boolean;
    setIsSidebarExpanded: Dispatch<SetStateAction<boolean>>;
    regenerateResponse: (messageId: string) => Promise<void>;
    editPrompt: (messageId: string, messageContent: string) => Promise<void>;
    createNewChat: () => void;
    isMdScreen: boolean;
    loadChats: () => void;
    language: Language;
    inputMessage: string;
    setInputMessage: Dispatch<SetStateAction<string>>;
}

const AppContext = createContext<AppContextValue | null>(null);

export const AppProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [messages, setMessages] = useState<Message[]>([]);
    const [isStreaming, setIsStreaming] = useState(false);
    const displayedMessages = useDisplayedMessages(messages);
    const { chatId } = useParams<{ chatId: string }>();
    const { appError, setAppError } = useError(chatId);
    const { startEventSource, stopEventSource } = useBaseEventSource(setIsStreaming, setAppError);
    const [selectedModel, setSelectedModel] = useState<Model | null>(null);
    const [inputAreaHeight, setInputContainerHeight] = useState(0);
    const [canShowGoDownButton, setCanShowGoDownButton] = useState(true);
    const [shouldAttachToBottom, setShouldAttachToBottom] = useState(false);
    const scrollToBottom = useScrollToBottom(setCanShowGoDownButton, setShouldAttachToBottom);
    const [hasChatScrollbar, setHasChatScrollbar] = useState(false);
    const { chats, chatsLoading, addChat, chatsEndRef, allChatsLoaded, loadChats } = useChats();
    const [isSidebarExpanded, setIsSidebarExpanded] = useState(false);
    const streamingData = {
        setMessages,
        appError,
        displayedMessages,
        setIsStreaming,
        startEventSource,
        selectedModel,
        setAppError,
        addChat,
    };
    const { regenerateResponse } = useRegenerateResponse(streamingData);
    const { editPrompt } = useEditPrompt(streamingData);
    const { createNewChat } = useCreateNewChat(setMessages, stopEventSource, setAppError);
    const { startChatEventSource } = useChatEventSource(streamingData);
    const [inputMessage, setInputMessage] = useState<string>("");
    const isMdScreen = useMediaQuery({ minWidth: 768 });
    const language = useLanguageDetection();

    return (
        <AppContext.Provider
            value={{
                inputMessage,
                setInputMessage,
                language,
                loadChats,
                isMdScreen,
                createNewChat,
                editPrompt,
                regenerateResponse,
                messages,
                setMessages,
                startEventSource,
                stopEventSource,
                isStreaming,
                setIsStreaming,
                appError,
                setAppError,
                displayedMessages,
                chatId,
                selectedModel,
                setSelectedModel,
                inputAreaHeight,
                setInputContainerHeight,
                canShowGoDownButton,
                setCanShowGoDownButton,
                shouldAttachToBottom,
                setShouldAttachToBottom,
                scrollToBottom,
                hasChatScrollbar,
                setHasChatScrollbar,
                chats,
                chatsLoading,
                startChatEventSource,
                chatsEndRef,
                allChatsLoaded,
                isSidebarExpanded,
                setIsSidebarExpanded,
            }}
        >
            {children}
        </AppContext.Provider>
    );
};

export const useAppContext = (): AppContextValue => {
    const context = useContext(AppContext);
    if (context === null) {
        throw new Error("useAppContext must be used within an AppProvider");
    }

    return context;
};
