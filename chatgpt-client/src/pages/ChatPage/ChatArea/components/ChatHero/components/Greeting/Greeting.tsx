import { Language } from "@/context/hooks/useLanguageDetection";
import useMediaQueries from "@/hooks/useMediaQueries";
import detectLanguage from "@/pages/ChatPage/ChatArea/components/ChatHero/components/Greeting/utils/detectLanguage";
import ScalingDot from "@/pages/ChatPage/ScalingDot";
import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useMemo, useState } from "react";

type ScreenSize = "xs" | "sm" | "lg";

interface DotPosition {
    en: number;
    ru: number;
}

const DOT_POSITIONS: Record<ScreenSize, DotPosition> = {
    xs: { en: 290, ru: 315 },
    sm: { en: 375, ru: 410 },
    lg: { en: 480, ru: 522 },
};

function getDotPosition(
    language: Language,
    { isXsScreen, isSmScreen }: { isXsScreen: boolean; isSmScreen: boolean },
): number {
    if (!isXsScreen) return DOT_POSITIONS.xs[language];
    if (!isSmScreen) return DOT_POSITIONS.sm[language];
    return DOT_POSITIONS.lg[language];
}

function createDotAnimation({
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
            transition: { duration: 0.9, delay: 0.6, ease: "easeOut" },
        },
        exit: {
            opacity: 0,
            y: 10,
            scale: 0.3,
            transition: { duration: 0.4 },
        },
    };
}

function greetingAnimation(index: number, isEnglish = true) {
    return {
        initial: { opacity: 0 },
        animate: { opacity: 1 },
        transition: {
            duration: isEnglish ? 0.9 : 1,
            delay: 0.7 + index * (isEnglish ? 0.1 : 0.18),
        },
    };
}

export default function Greeting({ greeting }: { greeting: string }) {
    const [showDot, setShowDot] = useState(true);
    const { isXsScreen, isSmScreen } = useMediaQueries();
    const language = detectLanguage();

    const animations = useMemo(() => {
        const getGreetingAnimation = (index: number) => greetingAnimation(index, language === "en");
        const dotAnimation = createDotAnimation({
            isEnglish: language === "en",
            screenInfo: { isXsScreen, isSmScreen },
        });
        return { getGreetingAnimation, dotAnimation };
    }, [language, isXsScreen, isSmScreen]);

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
                        className="absolute -mt-2 xs:-mt-1 sm:-mt-0"
                    >
                        <ScalingDot size={`${isSmScreen ? "large" : "middle"}`} />
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
