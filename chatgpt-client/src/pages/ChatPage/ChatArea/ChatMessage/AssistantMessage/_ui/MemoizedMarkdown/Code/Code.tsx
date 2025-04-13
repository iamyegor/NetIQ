import CheckmarkSvg from "@/assets/pages/chat/check.svg?react";
import ClipboardSvg from "@/assets/pages/chat/clipboard.svg?react";
import useMessageStore from "@/lib/zustand/messages/useMessageStore";
import useCodeHighlightTranslation from "@/pages/ChatPage/ChatArea/ChatMessage/AssistantMessage/CodeHightlight/_hooks/useCodeHighlightTranslation";
import { useEffect, useState } from "react";
import loadHighlightJs from "../utils/loadHighlightJs";

interface CodeProps {
    rawCode: string | undefined;
    className: string | undefined;
    shouldHighlightCode: boolean;
}

export default function Code({ rawCode, className, shouldHighlightCode }: CodeProps) {
    const { codeMap } = useMessageStore();
    const [isCopied, setIsCopied] = useState(false);
    const [highlightedCode, setHighlightedCode] = useState<string | null>(null);
    const t = useCodeHighlightTranslation();

    const languageMatch = /language-(\w+)/.exec(className || "");
    const language = languageMatch ? languageMatch[1] : "";

    useEffect(() => {
        if (!rawCode || !className) return;

        let code = codeMap.get(rawCode);

        if (!code && shouldHighlightCode) {
            loadHighlightJs()
                .then((hljs) => {
                    if (language && hljs.default.getLanguage(language)) {
                        code = hljs.default.highlight(rawCode, { language }).value;
                    } else {
                        code = hljs.default.highlightAuto(rawCode).value;
                    }
                    codeMap.set(rawCode, code);
                    setHighlightedCode(code);
                })
                .catch(() => {
                    setHighlightedCode(rawCode);
                });
        } else {
            setHighlightedCode(code || rawCode);
        }
    }, [rawCode, language, shouldHighlightCode, codeMap, className]);

    if (!rawCode) return null;
    if (!language) return <code>{rawCode}</code>;

    function handleCopy() {
        navigator.clipboard.writeText(rawCode!);
        setIsCopied(true);

        setTimeout(() => {
            setIsCopied(false);
        }, 1000);
    }

    return (
        <div className="rounded-2xl border overflow-hidden border-neutral-800 w-full">
            <div className="bg-secondary flex justify-between p-2.5 px-3 text-xs">
                <div>{language || "plaintext"}</div>
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
                <div className="overflow-scroll">
                    <code
                        className={`!bg-transparent`}
                        dangerouslySetInnerHTML={{ __html: highlightedCode || rawCode }}
                    />
                </div>
            </div>
        </div>
    );
}
