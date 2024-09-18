import { Form, useActionData, useNavigation } from "react-router-dom";
import { Button } from "@/components/ui/button.tsx";
import React from "react";
import PasswordInput from "@/components/ui/PasswordInput.tsx";

export default function ResetPasswordPage() {
    const actionData = useActionData() as { error: string } | null;
    const error = actionData?.error ?? null;
    const { state } = useNavigation();

    return (
        <div className="min-h-full flex justify-center items-center bg-neutral-950 py-5 px-2.5 xs:px-5 sm:px-10">
            <Form
                method="post"
                className="flex flex-col justify-center bg-neutral-800 w-full p-5 xs:p-8 max-w-lg gap-y-8 text-white rounded-xl relative border border-neutral-600"
            >
                <div className="text-center space-y-4">
                    <h1 className="text-2xl xs:text-3xl font-semibold">Восстановите пароль</h1>
                    <p className="text-base">Введите новый пароль для вашего аккаунта</p>
                </div>
                <PasswordInput
                    id="password"
                    name="password"
                    required
                    placeholder="Введите новый пароль"
                />
                <PasswordInput
                    id="confirmPassword"
                    name="confirmPassword"
                    required
                    placeholder="Повторите пароль"
                />
                {error && <p className="text-red-500 text-sm !-mt-3">{error}</p>}
                <Button
                    type="submit"
                    className="w-full !p-6"
                    disabled={state === "loading" || state === "submitting"}
                >
                    {state === "loading" || state === "submitting" ? (
                        <l-ring-2 color="#424242" size={25} stroke={4} />
                    ) : (
                        <span>Изменить пароль</span>
                    )}
                </Button>
            </Form>
        </div>
    );
}
