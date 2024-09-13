import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import React, { useState } from "react";
import { vscDarkPlus as theme } from "react-syntax-highlighter/dist/esm/styles/prism";
import ClipboardSvg from "@/assets/pages/chat/clipboard.svg?react";
import CheckmarkSvg from "@/assets/pages/chat/check.svg?react";

const customStyle = {
    ...theme,
    'code[class*="language-"]': {
        ...theme['code[class*="language-"]'],
        fontFamily: "'JetBrains Mono', monospace",
        fontSize: 14,
    },
    'pre[class*="language-"]': {
        ...theme['pre[class*="language-"]'],
        fontFamily: "'JetBrains Mono', monospace",
        fontSize: 14,
        padding: "20px",
        margin: 0,
    },
};

export default function CodeHighlight({
    children,
    className,
    node,
    ...rest
}: {
    node?: any;
    inline?: boolean;
    className?: string;
    children: React.ReactNode;
}) {
    const [isCopied, setIsCopied] = useState(false);
    const match = /language-(\w+)/.exec(className || "");

    function handleCopy() {
        navigator.clipboard.writeText(String(children));
        setIsCopied(true);

        setTimeout(() => {
            setIsCopied(false);
        }, 1000);
    }

    return match ? (
        <div className="border-4 border-neutral-900 rounded-2xl overflow-hidden">
            <div className="bg-neutral-900 flex justify-between p-2.5 px-3 text-xs">
                <div>{match[1]}</div>
                <button className="flex items-center space-x-1" onClick={handleCopy}>
                    {isCopied ? (
                        <CheckmarkSvg className="w-3 h-3 fill-neutral-200" />
                    ) : (
                        <ClipboardSvg className="w-3 h-3 fill-neutral-200" />
                    )}
                    <span>Скопировать</span>
                </button>
            </div>
            <SyntaxHighlighter
                {...rest}
                PreTag="div"
                children={String(children).replace(/\n$/, "")}
                className=""
                language={match[1]}
                style={customStyle}
            />
        </div>
    ) : (
        <code {...rest} className={className}>
            {children}
        </code>
    );
}
