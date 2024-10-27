import { Button } from "@/components/ui/button";
import { useAppContext } from "@/context/AppContext.tsx";
import { FaArrowDown } from "react-icons/fa";

export default function GoDownButton() {
    const {
        scrollToBottom,
        inputAreaHeight,
        shouldAttachToBottom,
        canShowGoDownButton,
        hasChatScrollbar,
    } = useAppContext();

    return !shouldAttachToBottom && canShowGoDownButton && hasChatScrollbar ? (
        <div
            className="absolute left-1/2 -translate-x-1/2 z-40"
            style={{ bottom: `${inputAreaHeight + 30}px` }}
        >
            <Button
                size="icon"
                className="!bg-secondary border border-neutral-700 rounded-full w-11 h-11 sm:w-9 sm:h-9 hover:border-neutral-600"
                onClick={() => scrollToBottom({ scrollType: "smooth" })}
            >
                <FaArrowDown className="text-neutral-200" />
            </Button>
        </div>
    ) : null;
}
