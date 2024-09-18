import React from "react";
import { Button } from "@/components/ui/button";
import { FaArrowDown } from "react-icons/fa";
import { useAppContext } from "@/context/AppContext.tsx";

const GoDownButton = () => {
    const {
        scrollToBottom,
        inputAreaHeight,
        shouldAttachToBottom,
        canShowGoDownButton,
        hasChatScrollbar,
    } = useAppContext();

    return !shouldAttachToBottom && canShowGoDownButton && hasChatScrollbar ? (
        <div className="absolute left-1/2 z-40" style={{ bottom: `${inputAreaHeight + 15}px` }}>
            <Button
                size="icon"
                variant="secondary"
                className="border border-neutral-600 rounded-full w-9 h-9 hover:border-neutral-500"
                onClick={() => scrollToBottom(true)}
            >
                <FaArrowDown />
            </Button>
        </div>
    ) : null;
};

export default GoDownButton;
