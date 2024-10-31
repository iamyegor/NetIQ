import useMediaQueries from "@/hooks/other/useMediaQueries.tsx";
import detectLanguage from "@/pages/ChatPage/ChatArea/ChatHero/Greeting/_utils/detectLanguage.ts";
import getDotPosition from "@/pages/ChatPage/ChatArea/ChatHero/Greeting/_utils/getDotPosition.ts";
import { useMemo } from "react";

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

function greetingAnimation(index: number, isEnglish = true) {
    return {
        initial: { opacity: 0 },
        animate: { opacity: 1 },
        transition: {
            duration: isEnglish ? 0.9 : 1,
            delay: 0.4 + index * (isEnglish ? 0.1 : 0.18),
        },
    };
}

export default function useAnimationsBasedOnLanguageAndScreenSize() {
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

    return animations;
}
