import React from "react";
import { Button } from "@/components/ui/button";
import { FaArrowDown } from "react-icons/fa";

const GoDownButton = ({ onClick, bottom }: { onClick: () => void; bottom: number }) => {
    return (
        <div className="absolute left-1/2 z-40" style={{ bottom: `${bottom}px` }}>
            <Button
                size="icon"
                variant="secondary"
                className="border border-neutral-600 rounded-full w-9 h-9 hover:border-neutral-500"
                onClick={onClick}
            >
                <FaArrowDown />
            </Button>
        </div>
    );
};

export default GoDownButton;
