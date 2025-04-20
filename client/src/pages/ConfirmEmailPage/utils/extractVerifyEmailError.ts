import { AxiosError } from "axios";
import ServerErrorResponse from "@/types/errors/ServerErrorResponse.ts";
import RouteError from "@/types/errors/RouteError.ts";

const emailVerificationTranslations = {
    en: {
        invalidLength: "The email verification code must contain 5 characters.",
        invalidCode: "The email verification code is invalid.",
        expiredCode: "The email verification code has expired.",
        unexpectedError: "An unexpected error occurred.",
    },
    ru: {
        invalidLength: "Код подтверждения электронной почты должен содержать 5 символов.",
        invalidCode: "Код подтверждения электронной почты недействителен.",
        expiredCode: "Код подтверждения электронной почты истек.",
        unexpectedError: "Произошла непредвиденная ошибка.",
    },
};

type EmailVerificationTranslations = typeof emailVerificationTranslations.en;

function getEmailVerificationTranslation(locale: string = window.uiLanguage) {
    return (
        emailVerificationTranslations[locale as keyof typeof emailVerificationTranslations] ||
        emailVerificationTranslations.en
    );
}

interface ErrorCodeMapping {
    [key: string]: keyof EmailVerificationTranslations;
}

const errorCodeMapping: ErrorCodeMapping = {
    "email.verification.code.has.invalid.length": "invalidLength",
    "email.verification.code.is.invalid": "invalidCode",
    "email.verification.code.is.expired": "expiredCode",
};

export default function extractVerifyEmailError(error: AxiosError<ServerErrorResponse>): string {
    const t = getEmailVerificationTranslation();
    const errorCode = error.response!.data.errorCode;
    const translationKey = errorCodeMapping[errorCode];

    if (translationKey === undefined) {
        throw RouteError.unexpected();
    }

    return t[translationKey];
}
