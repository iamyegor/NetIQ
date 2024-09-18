import React from "react";
import { Button } from "@/components/ui/button";
import PrevArrowSvg from "@/assets/pages/chat/prev-arrow.svg?react";
import NextArrowSvg from "@/assets/pages/chat/next-arrow.svg?react";

function VariantsPagination<T>({
    items,
    currentItem,
    onSelectItem,
}: {
    items: T[];
    currentItem: T;
    onSelectItem: (item: T) => void;
}) {
    const currentIndex = items.indexOf(currentItem);

    return (
        <div className="flex items-center space-x-2 text-neutral-200">
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
