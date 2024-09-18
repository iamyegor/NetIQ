import React from "react";

export type Message = {
    id: string;
    content: string;
    sender: "user" | "assistant";
    createdAt: string;
    linkId: string | null;
    isSelected: boolean;
};

export type Chat = {
    id: string;
    title: string;
    lastUpdatedAt: string;
};

export type Model = {
    id: string;
    name: string;
    description: string;
    icon: React.FunctionComponent<React.SVGProps<SVGSVGElement>>;
};

export interface ChatsResponse {
    chats: Chat[];
    nextPageNumber: number | null;
}

export type AppError = "messages_error" | "generic_error" | "message_too_long" | null;
