import { useEffect, useRef } from "react";

export default function HomePage() {
    const mainRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
    }, []);

    return (
        <div
            ref={mainRef}
            className="h-full w-full bg-neutral-950 flex justify-center items-center"
        >
            <h1 className="text-9xl font-extrabold text-white">NetIQ</h1>
        </div>
    );
}
