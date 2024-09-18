import { redirect } from "react-router-dom";
import authApi from "@/lib/authApi.ts";
import getCodeFromForm from "@/pages/ConfirmEmailPage/utils/getCodeFromForm.ts";
import FeedbackMessage from "@/types/FeedbackMessage.ts";
import extractVerifyEmailError from "@/pages/ConfirmEmailPage/utils/extractVerifyEmailError.ts";
import axios from "axios";
import RouteError from "@/types/errors/RouteError.ts";

export default async function confirmEmailPageAction({ request }: any) {
    const code: string = await getCodeFromForm(request, 5);

    if (code.length != 5) {
        return FeedbackMessage.createError("Код должен быть длиной 5 символов");
    }

    try {
        await authApi.post("confirm-email", { code });
        return redirect("/");
    } catch (error) {
        if (axios.isAxiosError(error)) {
            return FeedbackMessage.createError(extractVerifyEmailError(error));
        }

        throw RouteError.unexpected();
    }
}
