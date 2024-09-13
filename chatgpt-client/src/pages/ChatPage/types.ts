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
};
