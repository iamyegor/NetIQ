import authApi from "@/lib/authApi.ts";
import FieldError from "@/types/errors/FieldError.ts";
import RouteError from "@/types/errors/RouteError.ts";
import ServerErrorResponse from "@/types/errors/ServerErrorResponse.ts";
import axios, { AxiosError } from "axios";
import { redirect } from "react-router-dom";
import { translateSignUpError } from "../utils/translateSignUpError";

export async function signUpPageAction({ request }: { request: Request }) {
    const formData = await request.formData();
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;
    const confirmPassword = formData.get("confirmPassword") as string;

    if (!email || !password || !confirmPassword) {
        return {
            error: FieldError.create("form", translateSignUpError("form.all.fields.required")),
        };
    }
    if (password !== confirmPassword) {
        return {
            error: FieldError.create(
                "confirmPassword",
                translateSignUpError("passwords.do.not.match"),
            ),
        };
    }

    try {
        await authApi.post("auth/sign-up", { email, password });
        localStorage.setItem("email", email);

        return redirect("/confirm-email");
    } catch (error) {
        if (axios.isAxiosError(error)) {
            return { error: extractSignupError(error) };
        }

        return { error: FieldError.create("form", translateSignUpError("unexpected.error")) };
    }
}

function extractSignupError(error: AxiosError<ServerErrorResponse>): FieldError {
    const errorCode = error.response!.data.errorCode;
    if (errorsDictionary[errorCode] === undefined) {
        throw RouteError.unexpected();
    }
    return errorsDictionary[errorCode];
}

const errorsDictionary: Record<string, FieldError> = {
    "password.has.invalid.signature": FieldError.create(
        "password",
        translateSignUpError("password.has.invalid.signature"),
    ),
    "password.has.invalid.length": FieldError.create(
        "password",
        translateSignUpError("password.has.invalid.length"),
    ),
    "email.has.invalid.signature": FieldError.create(
        "email",
        translateSignUpError("email.has.invalid.signature"),
    ),
    "email.is.too.long": FieldError.create("email", translateSignUpError("email.is.too.long")),
    "email.is.already.taken": FieldError.create(
        "email",
        translateSignUpError("email.is.already.taken"),
    ),
};
