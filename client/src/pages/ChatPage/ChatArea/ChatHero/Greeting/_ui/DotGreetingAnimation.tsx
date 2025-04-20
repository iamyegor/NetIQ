import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useState, useMemo } from "react";
import useMediaQueries from "@/hooks/other/useMediaQueries";
import ScalingDot from "@/components/ui/ScalingDot";
import getDotPosition from "@/pages/ChatPage/ChatArea/ChatHero/Greeting/_utils/getDotPosition";
import detectLanguage from "@/pages/ChatPage/ChatArea/ChatHero/Greeting/_utils/detectLanguage";

export function createFadeInAnimation(index: number, isEnglish = true) {
    return {
        initial: { opacity: 0 },
        animate: { opacity: 1 },
        transition: {
            duration: isEnglish ? 0.9 : 1,
            delay: 0.4 + index * (isEnglish ? 0.1 : 0.18),
        },
    };
}

export function createDotAnimation({
    isEnglish,
    screenInfo,
}: {
    isEnglish: boolean;
    screenInfo: { isXsScreen: boolean; isSmScreen: boolean };
}) {
    const language = isEnglish ? "en" : "ru";

    return {
        initial: { x: 0 },
        animate: {
            x: getDotPosition(language, screenInfo),
            transition: { duration: 0.9, delay: 0.3, ease: "easeOut" },
        },
        exit: {
            opacity: 0,
            y: 10,
            scale: 0.3,
            transition: { duration: 0.4 },
        },
    };
}

export default function DotGreetingAnimation({ greeting }: { greeting: string }) {
    const [showDot, setShowDot] = useState(true);
    const { isXsScreen, isSmScreen } = useMediaQueries();
    const language = detectLanguage();

    const animations = useMemo(
        () => ({
            getGreetingAnimation: (index: number) =>
                createFadeInAnimation(index, language === "en"),
            dotAnimation: createDotAnimation({
                isEnglish: language === "en",
                screenInfo: { isXsScreen, isSmScreen },
            }),
        }),
        [language, isXsScreen, isSmScreen],
    );

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
                            {...animations.getGreetingAnimation(index)}
                            className="text-[20px] xs:text-[29px] sm:text-[39px] leading-[1.1] font-semibold text-neutral-100"
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
                        {...animations.dotAnimation}
                        className="absolute -mt-2 xs:-mt-1 sm:-mt-[3px]"
                    >
                        <ScalingDot size={`${isSmScreen ? "large" : "middle"}`} />
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
