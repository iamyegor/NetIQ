import SuccessOr from "@/types/results/SuccessOr.ts";

export const PWD_REGEX = new RegExp("^(?=.*[a-z])(?=.*[A-Z])(?=.*[\\d\\W]).*$");

export default function validatePasswordResetData({
    password,
    confirmPassword,
}: {
    password: string;
    confirmPassword: string;
}) {
    if (password.length < 6 || password.length > 50) {
        return SuccessOr.Fail("Длина пароля должна быть от 6 до 50 символов");
    }

    if (!PWD_REGEX.test(password)) {
        return SuccessOr.Fail(
            "Пароль должен содержать хотя бы одну заглавную букву, одну строчную букву и либо одну цифру, либо один спецсимвол",
        );
    }

    if (password !== confirmPassword) {
        return SuccessOr.Fail("Пароли не совпадают");
    }

    return SuccessOr.Ok<string>();
}
