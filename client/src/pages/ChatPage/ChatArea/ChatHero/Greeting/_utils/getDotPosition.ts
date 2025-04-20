import { Language } from "@/components/RootLayout/_hooks/useLanguageDetection";

type ScreenSize = "xs" | "sm" | "lg";

interface DotPosition {
    en: number;
    ru: number;
}

const DOT_POSITIONS: Record<ScreenSize, DotPosition> = {
    xs: { en: 285, ru: 315 },
    sm: { en: 370, ru: 410 },
    lg: { en: 475, ru: 522 },
};

export default function getDotPosition(
    language: Language,
    { isXsScreen, isSmScreen }: { isXsScreen: boolean; isSmScreen: boolean },
): number {
    if (!isXsScreen) return DOT_POSITIONS.xs[language];
    if (!isSmScreen) return DOT_POSITIONS.sm[language];
    return DOT_POSITIONS.lg[language];
}
