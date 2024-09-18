import authApi from "@/lib/authApi.ts";
import { redirect } from "react-router-dom";
import axios from "axios";

export default async function signInPageAction({ request }: { request: Request }) {
    const formData = await request.formData();
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;

    if (!email || !password) {
        return { error: "Все поля должны быть заполнены" };
    }

    try {
        await authApi.post("auth/sign-in", { email, password });
        return redirect("/");
    } catch (error) {
        if (
            axios.isAxiosError(error) &&
            error.response?.data?.errorCode === "user.invalid.login.or.password"
        ) {
            return { error: "Неверный email или пароль" };
        }

        return { error: "Произошла непредвиденная ошибка" };
    }
}
