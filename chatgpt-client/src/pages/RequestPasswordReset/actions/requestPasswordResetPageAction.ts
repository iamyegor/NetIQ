import authApi from "@/lib/authApi.ts";
import FeedbackMessage from "@/types/FeedbackMessage.ts";
import axios from "axios";
import RouteError from "@/types/errors/RouteError.ts";
import getRequestPasswordResetActionTranslations from "../hooks/getRequestPasswordResetActionTranslations";

export default async function requestPasswordResetPageAction({ request }: any) {
    const formData = await request.formData();
    const email = formData.get("email") as string;
    const locale = window.uiLanguage || "en";
    const t = getRequestPasswordResetActionTranslations(locale);

    try {
        await authApi.post("auth/request-password-reset", { email });
        return FeedbackMessage.createSuccess(t.successMessage);
    } catch (error) {
        if (axios.isAxiosError(error)) {
            if (error.response!.data.errorCode === "password.reset.is.already.requested") {
                return FeedbackMessage.createError(t.alreadyRequestedError);
            }

            return FeedbackMessage.createError(t.generalError);
        }

        throw RouteError.unexpected();
    }
}
