import { Language } from "@/components/RootLayout/_hooks/useLanguageDetection";

export default function detectLanguage(): Language {
    const primaryLanguage =
        navigator.language || (Array.isArray(navigator.languages) ? navigator.languages[0] : "en");

    const russianLanguages = ["ru", "ru-RU", "ru-UA", "ru-KZ", "ru-BY"];

    const isRussianPreferred =
        russianLanguages.includes(primaryLanguage) || primaryLanguage.startsWith("ru-");

    return isRussianPreferred ? "ru" : "en";
}
