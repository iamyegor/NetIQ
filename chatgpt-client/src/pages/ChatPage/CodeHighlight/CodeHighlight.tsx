import React, { useState } from "react";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { vscDarkPlus as theme } from "react-syntax-highlighter/dist/esm/styles/prism";
import ClipboardSvg from "@/assets/pages/chat/clipboard.svg?react";
import CheckmarkSvg from "@/assets/pages/chat/check.svg?react";
import useCodeHighlightTranslation from "./hooks/useCodeHighlightTranslation";

const customStyle = {
    ...theme,
    'code[class*="language-"]': {
        ...theme['code[class*="language-"]'],
        fontFamily: "'JetBrains Mono', monospace",
        fontSize: 14,
    },
    'pre[class*="language-"]': {
        ...theme['pre[class*="language-"]'],
        backgroundColor: "#18181b",
        fontFamily: "'JetBrains Mono', monospace",
        fontSize: 14,
        padding: "20px",
        margin: 0,
    },
};

interface CodeHighlightProps {
    children: React.ReactNode;
    className?: string;
    node?: any;
    inline?: boolean;
}

export default function CodeHighlight({ children, className, node, ...rest }: CodeHighlightProps) {
    const [isCopied, setIsCopied] = useState(false);
    const match = /language-(\w+)/.exec(className || "");
    const t = useCodeHighlightTranslation();

    function handleCopy() {
        navigator.clipboard.writeText(String(children));
        setIsCopied(true);

        setTimeout(() => {
            setIsCopied(false);
        }, 1000);
    }

    return match ? (
        <div className="rounded-2xl overflow-hidden border border-neutral-800">
            <div className="bg-secondary flex justify-between p-2.5 px-3 text-xs">
                <div>{match[1]}</div>
                <button className="flex items-center space-x-1" onClick={handleCopy}>
                    {isCopied ? (
                        <CheckmarkSvg className="w-3 h-3 fill-neutral-200" />
                    ) : (
                        <ClipboardSvg className="w-3 h-3 fill-neutral-200" />
                    )}
                    <span>{t.copy}</span>
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
        <code {...rest} className={`${className} text-wrap`}>
            {children}
        </code>
    );
}
