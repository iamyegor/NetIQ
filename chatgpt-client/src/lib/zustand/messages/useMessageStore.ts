import addContentToLastMessage from "@/lib/zustand/messages/utils/addContentToLastMessage";
import addNewMessage from "@/lib/zustand/messages/utils/addNewMessage";
import createMessageState from "@/lib/zustand/messages/utils/createMessageState";
import replaceFillerMessageIds from "@/lib/zustand/messages/utils/replaceFillerMessageIds";
import updateMessageSelection from "@/lib/zustand/messages/utils/updateMessageSelection";
import MessageIds from "@/types/MessageIds";
import { create } from "zustand";
import Message from "@/types/chat/Message.ts";

interface MessagesState {
    messages: Message[];
    displayedMessages: Message[];
    inputMessage: string;
    isStreaming: boolean;
    codeMap: Map<string, string>;
    setIsStreaming: (isStreaming: boolean) => void;
    selectMessage: (message: Message) => void;
    addNewMessage: (message: Message) => void;
    setMessages: (messages: Message[]) => void;
    setInputMessage: (message: string) => void;
    replaceFillerMessageIds: ({ userMessageId, assistantMessageId }: MessageIds) => void;
    addContentToLastMessage: (content: string) => void;
    messagesToMeasure: Message[];
    setMessagesToMeasure: (messagesToMeasure: Message[]) => void;
}

const useMessageStore = create<MessagesState>()((set) => ({
    messages: [],
    displayedMessages: [],
    inputMessage: "",
    isStreaming: false,
    codeMap: new Map(),
    messagesToMeasure: [],
    setMessagesToMeasure: (messagesToMeasure: Message[]) => set({ messagesToMeasure }),
    setMessages: (messages) => set(createMessageState(messages)),
    selectMessage: (messageToSelect: Message) =>
        set((state) => createMessageState(updateMessageSelection(state.messages, messageToSelect))),

    addNewMessage: (message: Message) =>
        set((state) => createMessageState(addNewMessage(state.messages, message))),

    setInputMessage: (inputMessage) => set({ inputMessage }),
    setIsStreaming: (isStreaming) => set({ isStreaming }),
    replaceFillerMessageIds: (newIds) =>
        set((state) => createMessageState(replaceFillerMessageIds(state.messages, newIds))),

    addContentToLastMessage: (content) =>
        set((state) => createMessageState(addContentToLastMessage(state.messages, content))),
}));

export default useMessageStore;
