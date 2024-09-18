import { redirect } from "react-router-dom";
import axios from "axios";
import authApi from "@/lib/authApi.ts";
import SuccessOr from "@/types/results/SuccessOr.ts";
import validatePasswordResetData from "@/pages/ResetPassword/utils/validatePasswordResetData.ts";

export default async function resetPasswordPageAction({
    request,
}: any): Promise<{ error: string } | Response> {
    const formData = await request.formData();
    const password = formData.get("password") as string;
    const confirmPassword = formData.get("confirmPassword") as string;

    const validationResult: SuccessOr<string> = validatePasswordResetData({
        password,
        confirmPassword,
    });
    if (validationResult.isFailure) {
        return { appError: validationResult.error! };
    }

    const url = new URL(request.url);
    const queryParams = new URLSearchParams(url.search);
    const token: string | null = queryParams.get("token");

    if (!token) return { appError: "Некорректная ссылка" };

    try {
        await authApi.post("auth/reset-password", { newPassword: password, token });
        return redirect("/");
    } catch (error) {
        if (axios.isAxiosError(error)) {
            const { errorCode } = error.response!.data;
            if (errorCode == "password.reset.is.same.as.current") {
                return { appError: "Новый пароль совпадает со старым" };
            }

            if (errorCode == "password.reset.token.is.invalid") {
                return { appError: "Некорректная ссылка" };
            }
        }

        return { appError: "Что-то пошло не так. Попробуйте позже" };
    }
}
