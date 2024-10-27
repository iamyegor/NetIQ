import PencilSvg from "@/assets/pages/chat/pencil.svg?react";
import { Button } from "@/components/ui/button.tsx";
import { Textarea } from "@/components/ui/textarea.tsx";
import { useAppContext } from "@/context/AppContext.tsx";
import { Message } from "@/pages/ChatPage/types.ts";
import VariantsPagination from "@/pages/ChatPage/VariantsPagination.tsx";
import { useEffect, useRef, useState } from "react";
import useUserMessageTranslation from "./hooks/useUserMessageTranslation";

export default function UserMessage({
    message,
    variants,
    selectVariant,
}: {
    message: Message;
    variants: Message[];
    selectVariant: (message: Message) => void;
}) {
    const textareaRef = useRef<HTMLTextAreaElement>(null);
    const [isEditing, setIsEditing] = useState(false);
    const [editedMessage, setEditedMessage] = useState<string>(message.content);
    const { scrollToBottom, editPrompt } = useAppContext();
    const t = useUserMessageTranslation();

    async function handleEditPrompt(messageId: string, messageContent: string) {
        await editPrompt(messageId, messageContent);
        setTimeout(() => scrollToBottom({ scrollType: "smooth" }), 70);
        setIsEditing(false);
    }

    const resizeTextarea = () => {
        if (textareaRef.current) {
            textareaRef.current.style.height = "auto";
            textareaRef.current.style.height = `${Math.max(textareaRef.current.scrollHeight, 57)}px`;
        }
    };

    useEffect(() => {
        resizeTextarea();
    }, [editedMessage, isEditing]);

    function cancel() {
        setIsEditing(false);
        setEditedMessage(message.content);
    }

    return (
        <div className="flex gap-x-2 justify-end group mb-8">
            {isEditing ? (
                <div className="w-full flex flex-col !bg-secondary border border-neutral-800 rounded-2xl overflow-hidden pr-5 py-4 space-y-2">
                    <Textarea
                        ref={textareaRef}
                        value={editedMessage}
                        onChange={(e) => setEditedMessage(e.target.value)}
                        className={`w-full text-white !bg-secondary max-h-[350px] focus-visible:outline-none ${textareaRef.current?.scrollHeight && textareaRef.current.scrollHeight < 350 ? "scrollbar-hide" : ""}`}
                    />
                    <div className="flex justify-end space-x-3">
                        <Button
                            className="rounded-2xl !text-white"
                            variant="cancel"
                            onClick={cancel}
                        >
                            {t.cancel}
                        </Button>
                        <Button
                            className="rounded-2xl"
                            onClick={() => handleEditPrompt(message.id, editedMessage)}
                        >
                            {t.send}
                        </Button>
                    </div>
                </div>
            ) : (
                <>
                    <div className="w-full max-w-[650px] flex flex-col items-end space-y-2">
                        <div className="flex space-x-2.5">
                            <Button
                                size="icon"
                                variant="ghost"
                                className="rounded-full hover:bg-neutral-100/10 mt-1 opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0"
                                onClick={() => setIsEditing(true)}
                            >
                                <PencilSvg className="w-4 h-4 fill-neutral-300" />
                            </Button>
                            <div className="p-3 rounded-2xl text-white bg-secondary border border-neutral-800 px-5">
                                <p className="break-all" style={{ whiteSpace: "pre-wrap" }}>
                                    {message.content}
                                </p>
                            </div>
                        </div>
                        {variants.length > 1 && (
                            <VariantsPagination
                                items={variants}
                                currentItem={message}
                                onSelectItem={selectVariant}
                            />
                        )}
                    </div>
                </>
            )}
        </div>
    );
}
