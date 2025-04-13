import Code from "@/pages/ChatPage/ChatArea/ChatMessage/AssistantMessage/_ui/MemoizedMarkdown/Code/Code";

import { HTMLAttributes, memo, useMemo } from "react";
import Markdown from "react-markdown";

const MemoizedMarkdown = memo(function MemoizedMarkdown({
    content,
    shouldHighlightCode,
}: {
    content: string;
    shouldHighlightCode: boolean;
}) {
    const components = useMemo(
        () => ({
            code: ({ children, ...rest }: HTMLAttributes<HTMLElement>) => (
                <Code
                    highlightingEnabled={shouldHighlightCode}
                    rawCode={children?.toString()}
                    className={rest?.className}
                />
            ),
        }),
        [shouldHighlightCode],
    );

    return (
        <Markdown
            className="flex flex-col gap-y-5 markdown-content break-words sm:break-normal"
            components={components}
        >
            {content}
        </Markdown>
    );
});

export default MemoizedMarkdown;
