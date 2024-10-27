import { useAppContext } from "@/context/AppContext";
import { useEffect, useState } from "react";

export default function useResizeInputAutomatically({
    inputMessage,
    duplicateTextArea,
}: {
    inputMessage: string;
    duplicateTextArea: HTMLTextAreaElement | null;
}) {
    const [textAreaHeight, setTextAreaHeight] = useState(0);
    const { chatId, setInputContainerHeight } = useAppContext();

    useEffect(() => {
        if (duplicateTextArea) {
            duplicateTextArea.style.height = "auto";
        }

        let height = Math.max(duplicateTextArea?.scrollHeight ?? 0, chatId ? 30 : 130);
        if (height > 250) {
            height = 250;
        }

        setTextAreaHeight(height);
        setInputContainerHeight(height + 70);
    }, [chatId, inputMessage]);

    return { textAreaHeight };
}
