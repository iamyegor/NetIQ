import authApi from "@/lib/authApi.ts";
import FeedbackMessage from "@/types/FeedbackMessage.ts";
import axios from "axios";
import RouteError from "@/types/errors/RouteError.ts";

export default async function requestPasswordResetPageAction({ request }: any) {
    const formData = await request.formData();
    const email = formData.get("email") as string;

    try {
        await authApi.post("auth/request-password-reset", { email });
        return FeedbackMessage.createSuccess(
            "На почту было отправлено письмо с инструкциями по сбросу пароля.",
        );
    } catch (error) {
        if (axios.isAxiosError(error)) {
            if (error.response!.data.errorCode === "password.reset.is.already.requested") {
                return FeedbackMessage.createError(
                    "Сброс пароля уже запрошен, проверьте вашу почту и папку спам.",
                );
            }

            return FeedbackMessage.createError(
                "Ошибка при запросе сброса пароля. Проверьте, что пользователь с такой почтой зарегистрирован и попробуйте снова.",
            );
        }

        throw RouteError.unexpected();
    }
}
