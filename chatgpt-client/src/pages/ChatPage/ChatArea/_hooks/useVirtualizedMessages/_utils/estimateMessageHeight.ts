import ElementType from "@/pages/ChatPage/ChatArea/_hooks/useVirtualizedMessages/types/ElementType";
import Message from "@/types/chat/Message";

export default function estimateMessageHeight(message: Message, containerWidth: number): number {
    const lineHeights: Record<string, number> = {
        normal: 24,
        empty: 20,
        code: 20,
        codeNoLangMin: 48,
        codeWithLangMin: 65,
        h1: 36,
        h2: 32,
        h3: 28,
        h4: 28,
        h5: 24,
        h6: 24,
        hr: 32,
        li: 24,
        blockquote: 24,
        gapBetweenLiElements: 20,
    };

    let totalHeight = 0;
    const lines = message.content.split("\n");
    let inCodeBlock = false;
    let codeBlockLangSpecified = false;
    let inList = false;
    let isFirstListItem = false;

    for (let line of lines) {
        const trimmedLine = line.trim();

        if (trimmedLine.startsWith("```")) {
            if (!inCodeBlock) {
                inCodeBlock = true;
                codeBlockLangSpecified = trimmedLine.length > 3;
                totalHeight += codeBlockLangSpecified
                    ? lineHeights.codeWithLangMin
                    : lineHeights.codeNoLangMin;
            } else {
                inCodeBlock = false;
            }
            continue;
        }

        if (inCodeBlock) {
            totalHeight += lineHeights.code;
            continue;
        }

        if (trimmedLine === "") {
            totalHeight += lineHeights.empty;
            continue;
        }

        let elementType = "normal";
        let lineHeight = lineHeights.normal;

        if (/^#+\s/.test(trimmedLine)) {
            const match = trimmedLine.match(/^#+/);
            if (match) {
                const headerLevel = match[0].length;
                elementType = `h${headerLevel}`;
                lineHeight = lineHeights[elementType as ElementType];
                inList = false;
            }
        } else if (trimmedLine.startsWith("---") || trimmedLine.startsWith("***")) {
            totalHeight += lineHeights.hr;
            inList = false;
            continue;
        } else if (/^([*\-+])\s+/.test(trimmedLine) || /^\d+\.\s+/.test(trimmedLine)) {
            elementType = "li";
            lineHeight = lineHeights.li;
            if (!inList) {
                inList = true;
                isFirstListItem = true;
            } else {
                isFirstListItem = false;
            }
        } else {
            inList = false;
        }

        if (trimmedLine.startsWith(">")) {
            elementType = "blockquote";
            lineHeight = lineHeights.blockquote;
            inList = false;
        }

        const textWidth = measureTextWidth(trimmedLine);
        const visualLineCount = Math.ceil(textWidth / containerWidth);

        if (inList && !isFirstListItem) {
            totalHeight += lineHeights.gapBetweenLiElements;
        }

        totalHeight += visualLineCount * lineHeight;
    }

    const paddingHeight = message.sender === "user" ? 71 : 40;
    return totalHeight + paddingHeight;
}

function measureTextWidth(text: string): number {
    return text.length * 7.6; // Approximate average character width
}
