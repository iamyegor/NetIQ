import { useMemo } from "react";

const translations = [
    {
        locale: "en",
        upgrade: "Upgrade your plan",
        free: "Free",
        plus: "Plus",
        perMonth: "$ per month",
        currentPlan: "Current plan",
        upgradeToPremium: "Upgrade to Plus",
        writingAssistance: "Help with writing, problem-solving, and more",
        accessToGPT4oMini: "Access to GPT-4o mini",
        accessToCopyRecreate: "Access to copying, recreating answers, and modifying queries",
        accessToGPT4o: "Access to GPT-4o",
        fiveTimesMoreMessages: "Up to 5 times more messages",
        paymentError: "An error occurred while trying to upgrade to Plus subscription.",
        regionUnavailable:
            "Subscription is currently unavailable in your region. We are working on it.",
        price: 20
    },
    {
        locale: "ru",
        upgrade: "Обновите свой план",
        free: "Бесплатно",
        plus: "Plus",
        perMonth: "₽ в месяц",
        currentPlan: "Текущий план",
        upgradeToPremium: "Перейти на Plus",
        writingAssistance: "Помощь в написании, решении проблем и многое другое",
        accessToGPT4oMini: "Доступ к GPT-4o mini",
        accessToCopyRecreate: "Доступ к копированию, пересозданию ответов и изменению запросов",
        accessToGPT4o: "Доступ к GPT-4o",
        fiveTimesMoreMessages: "До 5 раз больше сообщений",
        paymentError: "Произоишла ошибка при попытке перейти на Plus подписку.",
        regionUnavailable:
            "Оформление подписки пока недоступно в вашем регионе. Мы уже работает над этим.",
        price: 1500
    },
];

export default function usePricingTranslation() {
    const currentLanguage = window.uiLanguage;
    return useMemo(
        () =>
            translations.find((translation) => translation.locale === currentLanguage) ??
            translations[0],
        [currentLanguage],
    );
}