import { Code, FileText, HelpCircle, Zap } from "lucide-react";
import { useMemo } from "react";
import CodeSvg from "@/pages/ChatPage/ChatArea/ChatHero/_assets/code.svg?react";
import ConceptSvg from "@/pages/ChatPage/ChatArea/ChatHero/_assets/concept.svg?react";
import ContentSvg from "@/pages/ChatPage/ChatArea/ChatHero/_assets/content.svg?react";
import PuzzleSvg from "@/pages/ChatPage/ChatArea/ChatHero/_assets/puzzle.svg?react";

const iconClass = "w-4 h-4 flex-shrink-0";

export const translations = [
    {
        locale: "en",
        tryPrompts: "Try these prompts:",
        suggestedPrompts: [
            {
                icon: <Code className={iconClass} />,
                label: "Write Code",
                prompt: "I need help writing code to [your task]. I'm using [programming language] and want to [specific goal]. Can you guide me through this step by step?",
            },
            {
                icon: <Zap className={iconClass} />,
                label: "Master Concepts",
                prompt: "Explain [topic] to me like I'm a beginner. Use simple examples and break it down into its most essential parts.",
            },
            {
                icon: <FileText className={iconClass} />,
                label: "Create Content",
                prompt: "Help me write a [type of content] about [topic]. Make it [length] and focus on [specific aspects]. The target audience is [description].",
            },
            {
                icon: <HelpCircle className={iconClass} />,
                label: "Solve Problems",
                prompt: "I'm trying to solve this problem: [describe situation]. What are the key factors I should consider, and what are some potential solutions?",
            },
        ],
    },
    {
        locale: "ru",
        tryPrompts: "Попробуйте эти запросы:",
        suggestedPrompts: [
            {
                icon: <CodeSvg className={iconClass} />,
                label: "Написать код",
                prompt: "Мне нужна помощь с написанием кода для [твоя задача]. Я использую [язык программирования] и хочу [конкретная цель]. Можешь провести меня через это шаг за шагом?",
            },
            {
                icon: <ConceptSvg className={iconClass} />,
                label: "Освоить концепции",
                prompt: "Объясни мне [тема], как будто я новичок. Используй простые примеры и разбери на самые основные части.",
            },
            {
                icon: <ContentSvg className={iconClass} />,
                label: "Создать контент",
                prompt: "Помоги мне написать [тип контента] на тему [тема]. Сделай его [длина] и сосредоточься на [конкретные аспекты]. Целевая аудитория — [описание].",
            },
            {
                icon: <PuzzleSvg className={iconClass} />,
                label: "Решить проблемы",
                prompt: "Я пытаюсь решить эту проблему: [опишите ситуацию]. Какие ключевые факторы мне стоит учесть, и какие есть возможные решения?",
            },
        ],
    },
];

export default function useChatHeroTranslationts() {
    const currentLanguage = window.uiLanguage;

    return useMemo(
        () =>
            translations.find((translation) => translation.locale === currentLanguage) ??
            translations[0],
        [currentLanguage],
    );
}
