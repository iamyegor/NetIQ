import Code from "@/pages/ChatPage/ChatArea/ChatMessage/AssistantMessage/_ui/MemoizedMarkdown/Code/Code";

import { useMemo } from "react";
import Markdown from "react-markdown";

export default function MemoizedMarkdown({
    content,
    shouldHighlightCode,
}: {
    content: string;
    shouldHighlightCode: boolean;
}) {
    return useMemo(
        () => (
            <Markdown
                className="flex flex-col gap-y-5 markdown-content break-all sm:break-normal"
                components={{
                    code: ({ children, ...rest }) => {
                        return (
                            <Code
                                shouldHighlightCode={shouldHighlightCode}
                                rawCode={children?.toString()}
                                className={rest?.className}
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
