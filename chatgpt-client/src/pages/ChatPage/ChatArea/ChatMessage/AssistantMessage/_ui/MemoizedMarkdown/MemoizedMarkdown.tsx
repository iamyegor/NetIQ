import Code from "@/pages/ChatPage/ChatArea/ChatMessage/AssistantMessage/_ui/MemoizedMarkdown/Code/Code";

import "highlight.js/styles/atom-one-dark.css";
import { useMemo, useRef } from "react";
import Markdown from "react-markdown";

export default function MemoizedMarkdown({ content }: { content: string }) {
    const codeDictionary = useRef<Record<string, string>>({});

    return useMemo(
        () => (
            <Markdown
                className="flex flex-col gap-y-5 markdown-content"
                components={{
                    code: ({ children, ...rest }) => {
                        return (
                            <Code
                                rawCode={children?.toString()}
                                className={rest?.className}
                                codeDictionary={codeDictionary.current}
                            />
                        );
                    },
                }}
            >
                {content}
            </Markdown>
        ),
        [content],
    );
}
