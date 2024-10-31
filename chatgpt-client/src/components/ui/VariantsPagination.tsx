import NextArrowSvg from "@/assets/pages/chat/next-arrow.svg?react";
import PrevArrowSvg from "@/assets/pages/chat/prev-arrow.svg?react";
import { Button } from "@/components/ui/button.tsx";

function VariantsPagination<T>({
    items,
    currentItem,
    onSelectItem,
    addMarginRight,
}: {
    items: T[];
    currentItem: T;
    onSelectItem: (item: T) => void;
    addMarginRight?: boolean;
}) {
    const currentIndex = items.indexOf(currentItem);

    return (
        <div
            className={`flex items-center space-x-0.5 text-neutral-200 ${addMarginRight ? "mr-4" : ""}`}
        >
            <Button
                variant="arrow"
                disabled={currentItem === items[0]}
                onClick={() => onSelectItem(items[currentIndex - 1])}
            >
                <PrevArrowSvg className="w-full h-full" />
            </Button>
            <p className="space-x-1 font-medium">
                <span>{currentIndex + 1}</span>
                <span>/</span>
                <span>{items.length}</span>
            </p>
            <Button
                variant="arrow"
                disabled={currentItem === items[items.length - 1]}
                onClick={() => onSelectItem(items[currentIndex + 1])}
            >
                <NextArrowSvg className="w-full h-full" />
            </Button>
        </div>
    );
}

export default VariantsPagination;
