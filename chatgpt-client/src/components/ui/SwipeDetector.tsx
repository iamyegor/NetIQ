import useUiStore from "@/lib/zustand/ui/useUiStore";
import React, { useEffect, useRef } from "react";

interface TouchPosition {
    x: number;
    y: number;
}

export default function SwipeDetector({ children }: { children: React.ReactNode }) {
    const { setIsSidebarExpanded } = useUiStore();
    const touchStart = useRef<TouchPosition>({ x: 0, y: 0 });
    const touchStartElement = useRef<Element | null>(null);

    useEffect(() => {
        document.addEventListener("touchstart", handleTouchStart);
        document.addEventListener("touchend", handleTouchEnd);

        return () => {
            document.removeEventListener("touchstart", handleTouchStart);
            document.removeEventListener("touchend", handleTouchEnd);
        };
    }, [setIsSidebarExpanded]);

    function handleTouchStart(e: TouchEvent) {
        touchStart.current = {
            x: e.touches[0].clientX,
            y: e.touches[0].clientY,
        };

        touchStartElement.current = e.target as Element;
    }

    function handleTouchEnd(e: TouchEvent) {
        const touchEndX = e.changedTouches[0].clientX;
        const touchEndY = e.changedTouches[0].clientY;

        const horizontalDistance = touchEndX - touchStart.current.x;
        const verticalDistance = Math.abs(touchEndY - touchStart.current.y);

        const scrollableParent = findScrollableParent(touchStartElement.current);

        if (
            !scrollableParent &&
            horizontalDistance > 30 &&
            horizontalDistance > verticalDistance * 2 &&
            verticalDistance < 40
        ) {
            setIsSidebarExpanded(true);
        }
    }

    function findScrollableParent(element: Element | null): Element | null {
        while (element && element !== document.body) {
            if (isElementScrollableHorizontally(element)) {
                return element;
            }
            element = element.parentElement;
        }
        return null;
    }

    function isElementScrollableHorizontally(element: Element): boolean {
        return element.scrollWidth > element.clientWidth + 10;
    }

    return <>{children}</>;
}
