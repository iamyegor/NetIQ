export default interface Message {
    id: string;
    content: string;
    sender: "user" | "assistant";
    createdAt: string;
    linkId: string | null;
    isSelected: boolean;
}
