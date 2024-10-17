import authApi from "@/lib/authApi.ts";
import extractVerifyEmailError from "@/pages/ConfirmEmailPage/utils/extractVerifyEmailError.ts";
import getCodeFromForm from "@/pages/ConfirmEmailPage/utils/getCodeFromForm.ts";
import RouteError from "@/types/errors/RouteError.ts";
import FeedbackMessage from "@/types/FeedbackMessage.ts";
import axios from "axios";
import { redirect } from "react-router-dom";
import { getConfirmEmailErrorTranslatino } from "../utils/getConfirmEmailErrorTranslatino";

export default async function confirmEmailPageAction({ request }: any) {
    const code: string = await getCodeFromForm(request, 5);
    const t = getConfirmEmailErrorTranslatino();

    if (code.length != 5) {
        return FeedbackMessage.createError(t.shortCode);
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
