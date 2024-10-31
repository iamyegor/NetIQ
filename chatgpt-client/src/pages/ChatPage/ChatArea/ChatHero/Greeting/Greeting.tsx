import useMediaQueries from "@/hooks/other/useMediaQueries.tsx";
import useAnimationsBasedOnLanguageAndScreenSize from "@/pages/ChatPage/ChatArea/ChatHero/Greeting/_hooks/useAnimationsBasedOnLanguageAndScreenSize.ts";
import ScalingDot from "@/components/ui/ScalingDot.tsx";
import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useState } from "react";

export default function Greeting({ greeting }: { greeting: string }) {
    const [showDot, setShowDot] = useState(true);
    const { isSmScreen } = useMediaQueries();
    const animations = useAnimationsBasedOnLanguageAndScreenSize();

    useEffect(() => {
        const timeout = setTimeout(() => setShowDot(false), 1500);
        return () => clearTimeout(timeout);
    }, []);

    const words = greeting.split(" ");

    return (
        <div className="relative flex gap-2 p-4">
            <AnimatePresence mode="wait">
                <div className="flex gap-2">
                    {words.map((word, index) => (
                        <motion.span
                            key={`${word}-${index}`}
                            {...animations?.getGreetingAnimation(index)}
                            className="text-[20px] xs:text-[27px] sm:text-[36px] leading-[1.1] font-semibold text-neutral-100"
                        >
                            {word}
                        </motion.span>
                    ))}
                </div>
            </AnimatePresence>

            <AnimatePresence mode="wait">
                {showDot && (
                    <motion.div
                        key="dot"
                        {...animations?.dotAnimation}
                        className="absolute -mt-2 xs:-mt-1 sm:-mt-[3px]"
                    >
                        <ScalingDot size={`${isSmScreen ? "large" : "middle"}`} />
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
