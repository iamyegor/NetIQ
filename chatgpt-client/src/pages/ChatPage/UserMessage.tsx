import { Message } from "@/pages/ChatPage/types.ts";
import React, { useEffect, useRef, useState } from "react";
import PencilSvg from "@/assets/pages/chat/pencil.svg?react";
import { Button } from "@/components/ui/button.tsx";
import { Textarea } from "@/components/ui/textarea.tsx";
import VariantsPagination from "@/pages/ChatPage/VariantsPagination.tsx";

const UserMessage = ({
    message,
    editPrompt,
    variants,
    selectVariant,
}: {
    message: Message;
    editPrompt: (messageId: string, messageContent: string) => void;
    variants: Message[];
    selectVariant: (message: Message) => void;
}) => {
    const textareaRef = useRef<HTMLTextAreaElement>(null);
    const [isEditing, setIsEditing] = useState(false);
    const [editedMessage, setEditedMessage] = useState<string>(message.content);

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
        <div className="flex gap-x-2 justify-end group">
            {isEditing ? (
                <div className="w-full flex flex-col !bg-[#333333] rounded-[35px] overflow-hidden pr-5 py-4 space-y-2">
                    <Textarea
                        ref={textareaRef}
                        value={editedMessage}
                        onChange={(e) => setEditedMessage(e.target.value)}
                        className={`w-full text-white !bg-[#333333] max-h-[350px] focus-visible:outline-none ${textareaRef.current?.scrollHeight && textareaRef.current.scrollHeight < 350 ? "scrollbar-hide" : ""}`}
                    />
                    <div className="flex justify-end space-x-3">
                        <Button
                            className="rounded-2xl !text-white"
                            variant="cancel"
                            onClick={cancel}
                        >
                            Отменить
                        </Button>
                        <Button
                            className="rounded-2xl"
                            onClick={() => editPrompt(message.id, editedMessage)}
                        >
                            Отправить
                        </Button>
                    </div>
                </div>
            ) : (
                <>
                    <Button
                        size="icon"
                        variant="ghost"
                        className="rounded-full hover:bg-neutral-100/10 mt-1 opacity-0 group-hover:opacity-100 transition-opacity"
                        onClick={() => setIsEditing(true)}
                    >
                        <PencilSvg className="w-4 h-4 fill-neutral-300" />
                    </Button>
                    <div className="max-w-[600px] flex flex-col items-end space-y-2">
                        <div className="p-3 rounded-[25px] text-white bg-neutral-700/50 px-5">
                            <p className="break-words" style={{ whiteSpace: "pre-wrap" }}>
                                {message.content}
                            </p>
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
};

export default UserMessage;
