import CheckmarkSvg from "@/assets/pages/chat/check.svg?react";
import ClipboardSvg from "@/assets/pages/chat/clipboard.svg?react";
import useCodeHighlightTranslation from "@/pages/ChatPage/ChatArea/ChatMessage/AssistantMessage/CodeHightlight/_hooks/useCodeHighlightTranslation";
import { useState } from "react";
import hljs from "highlight.js";

interface CodeProps {
    rawCode: string | undefined;
    className: string | undefined;
    codeDictionary: Record<string, string>;
}

export default function Code({ rawCode, className, codeDictionary }: CodeProps) {
    const [isCopied, setIsCopied] = useState(false);
    const t = useCodeHighlightTranslation();

    if (!rawCode) return null;
    if (!className) return <code>{rawCode}</code>;

    const language = /language-(\w+)/.exec(className || "")![1];

    let code = "";
    if (codeDictionary[rawCode]) {
        code = codeDictionary[rawCode];
    } else {
        code = hljs.highlight(rawCode, { language: language }).value;
        codeDictionary[rawCode] = code;
    }

    function handleCopy() {
        navigator.clipboard.writeText(code);
        setIsCopied(true);

        setTimeout(() => {
            setIsCopied(false);
        }, 1000);
    }

    return (
        <div className="rounded-2xl overflow-hidden border border-neutral-800">
            <div className="bg-secondary flex justify-between p-2.5 px-3 text-xs">
                <div>{language}</div>
                <button className="flex items-center space-x-1" onClick={handleCopy}>
                    {isCopied ? (
                        <CheckmarkSvg className="w-3 h-3 fill-neutral-200" />
                    ) : (
                        <ClipboardSvg className="w-3 h-3 fill-neutral-200" />
                    )}
                    <span>{t.copy}</span>
                </button>
            </div>
            <div
                className="bg-[#18181b] text-sm p-5 py-3 pr-0"
                style={{ fontFamily: "'JetBrains Mono', monospace" }}
            >
                <pre className="m-0 overflow-scroll">
                    <code
                        className={`!bg-transparent`}
                        dangerouslySetInnerHTML={{ __html: code }}
                    />
                </pre>
            </div>
        </div>
    );
}
