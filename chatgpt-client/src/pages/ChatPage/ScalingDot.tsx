import React, { useState, useEffect, forwardRef, ForwardedRef } from "react";

const MIN_SCALE: number = 0.8; // Equivalent to 8px if base is 10px
const MAX_SCALE: number = 1.1; // Equivalent to 12px if base is 10px

const ScalingDot = forwardRef((_, ref: ForwardedRef<HTMLDivElement>) => {
    const [scale, setScale] = useState<number>(MIN_SCALE);
    const [scalingUp, setScalingUp] = useState<boolean>(true);

    useEffect(() => {
        const intervalId = setInterval(() => {
            setScale((prevScale) => {
                if (prevScale >= MAX_SCALE) {
                    setScalingUp(false);
                } else if (prevScale <= MIN_SCALE) {
                    setScalingUp(true);
                }
                return scalingUp ? prevScale + 0.01 : prevScale - 0.01;
            });
        }, 20);

        return () => clearInterval(intervalId);
    }, [scalingUp]);

    return (
        <div
            ref={ref}
            id="scaling-dot"
            className={`inline-flex justify-center items-center relative`}
        >
            <div
                className="bg-white rounded-full w-4 h-4 transform absolute -top-3.5 left-2"
                style={{ transform: `scale(${scale})` }}
            />
        </div>
    );
});

export default ScalingDot;
