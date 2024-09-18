import React from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Form, Link, useActionData, useNavigation } from "react-router-dom";
import netIqLogo from "@/assets/common/netiq.png";
import PasswordInput from "@/components/ui/PasswordInput";

export default function SignInPage() {
    const actionData = useActionData() as { error: string } | undefined;
    const { state } = useNavigation();
    const error = actionData?.error ?? null;

    return (
        <div className="min-h-full bg-neutral-950 flex items-center justify-center py-5 px-2.5 xs:px-5 sm:px-10">
            <div className="bg-neutral-800 p-4 xs:p-8 pt-5 rounded-xl shadow-lg w-full max-w-md space-y-8 border border-neutral-600">
                <div className="flex flex-col items-center space-y-6">
                    <img src={netIqLogo} alt="Логотип" className="h-20 object-cover" />
                    <h2 className="text-2xl font-bold text-white text-center">Вход в аккаунт</h2>
                </div>

                <Form method="post" className="space-y-4 text-white">
                    <div className="space-y-4">
                        <Label htmlFor="email" className="text-white">
                            Email
                        </Label>
                        <Input
                            id="email"
                            name="email"
                            type="email"
                            className="w-full rounded-xl !p-6 !pl-4 !border-neutral-500"
                            required
                        />
                    </div>

                    <div className="space-y-4">
                        <Label htmlFor="password" className="text-white">
                            Пароль
                        </Label>
                        <PasswordInput id="password" name="password" required />
                        <p className="space-x-2 text-sm">
                            <span>Забыли пароль?</span>
                            <Link
                                className="text-blue-400 hover:underline"
                                to="/request-password-reset"
                            >
                                Восстановить доступ
                            </Link>
                        </p>
                    </div>

                    {error && <p className="text-red-500 text-sm !mt-6">{error}</p>}

                    <Button
                        type="submit"
                        className="w-full !p-6 !mt-8"
                        disabled={state === "loading" || state === "submitting"}
                    >
                        {state === "loading" || state === "submitting" ? (
                            <l-ring-2 color="#424242" size={25} stroke={4} />
                        ) : (
                            <span>Войти</span>
                        )}
                    </Button>
                </Form>

                <p className="text-center text-white !mt-10 text-sm text-nowrap">
                    Еще нет аккаунта?{" "}
                    <Link to="/sign-up" className="text-blue-400 hover:underline">
                        Зарегистрироваться
                    </Link>
                </p>
            </div>
        </div>
    );
}
