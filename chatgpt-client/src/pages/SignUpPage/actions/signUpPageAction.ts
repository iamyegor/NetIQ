import { redirect } from "react-router-dom";
import axios, { AxiosError } from "axios";
import ServerErrorResponse from "@/types/errors/ServerErrorResponse.ts";
import FieldError from "@/types/errors/FieldError.ts";
import authApi from "@/lib/authApi.ts";
import RouteError from "@/types/errors/RouteError.ts";

export async function signUpPageAction({ request }: { request: Request }) {
    const formData = await request.formData();
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;
    const confirmPassword = formData.get("confirmPassword") as string;

    if (!email || !password || !confirmPassword) {
        return { error: FieldError.create("form", "Все поля должны быть заполнены") };
    }
    if (password !== confirmPassword) {
        return { error: FieldError.create("confirmPassword", "Пароли не совпадают") };
    }

    try {
        await authApi.post("auth/sign-up", { email, password });
        localStorage.setItem("email", email);
        
        return redirect("/confirm-email");
    } catch (error) {
        if (axios.isAxiosError(error)) {
            return { error: extractSignupError(error) };
        }

        return { error: FieldError.create("form", "Произошла непредвиденная ошибка") };
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
        "Ваш пароль должен содержать как минимум одну строчную букву, одну заглавную букву и одну цифру или специальный символ.",
    ),
    "password.has.invalid.length": FieldError.create("password", "Недопустимая длина пароля"),
    "email.has.invalid.signature": FieldError.create(
        "email",
        "Электронная почта содержит неверную подпись",
    ),
    "email.is.too.long": FieldError.create("email", "Электронная почта слишком длинная"),
    "email.is.already.taken": FieldError.create("email", "Электронная почта уже занята"),
};
