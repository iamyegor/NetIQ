// useSidebarTranslations.ts
import { useMemo } from "react";

const sidebarTranslations = [
    {
        locale: "en",
        newChat: "New chat",
        today: "Today",
        yesterday: "Yesterday",
        lastSevenDays: "Last 7 days",
        lastThirtyDays: "Last 30 days",
        upgradePlan: "Upgrade your plan",
        getMoreFeatures: "Get more features",
        profile: "Profile",
    },
    {
        locale: "ru",
        newChat: "Новый чат",
        today: "Сегодня",
        yesterday: "Вчера",
        lastSevenDays: "Последние 7 дней",
        lastThirtyDays: "Последние 30 дней",
        upgradePlan: "Улучшите свой план",
        getMoreFeatures: "Получите больше возможностей",
        profile: "Профиль",
    },
];

export type SidebarTranslation = (typeof sidebarTranslations)[0];

export default function useSidebarTranslations() {
    const currentLanguage = window.uiLanguage;

    return useMemo(() => {
        return (
            sidebarTranslations.find((translation) => translation.locale === currentLanguage) ??
            sidebarTranslations[0]
        );
    }, [currentLanguage]);
}

