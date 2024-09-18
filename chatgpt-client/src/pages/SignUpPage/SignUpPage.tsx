import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Form, Link, useActionData, useNavigation } from "react-router-dom";
import FieldError from "@/types/errors/FieldError";
import netIqLogo from "@/assets/common/netiq.png";
import PasswordInput from "@/components/ui/PasswordInput.tsx";

export default function SignUpPage() {
    const actionData = useActionData() as { error: FieldError } | null;
    const { state } = useNavigation();
    const error = actionData?.error ?? null;

    return (
        <div className="min-h-full bg-neutral-950 flex items-center justify-center py-5 px-2.5 xs:px-5 sm:px-10">
            <div className="bg-neutral-800 p-8 pt-5 rounded-xl shadow-lg w-full max-w-md space-y-8 border border-neutral-600">
                <div className="flex flex-col items-center space-y-6">
                    <img src={netIqLogo} alt="Логотип" className="h-20 object-cover" />
                    <h2 className="text-2xl font-bold text-white text-center">Регистрация</h2>
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
                            className={`w-full rounded-xl !p-6 !pl-4 !border-neutral-500 ${error?.isField("email") ? "border border-red-500" : ""}`}
                            required
                        />
                        {error?.forField("email") && (
                            <p className="text-red-500 text-sm mt-1">{error.forField("email")}</p>
                        )}
                    </div>
                    <div className="space-y-4">
                        <Label htmlFor="password" className="text-white">
                            Пароль
                        </Label>
                        <PasswordInput
                            id="password"
                            name="password"
                            error={error?.isField("password")}
                            required
                        />
                        {error?.forField("password") && (
                            <p className="text-red-500 text-sm mt-1">
                                {error.forField("password")}
                            </p>
                        )}
                    </div>
                    <div className="space-y-4">
                        <Label htmlFor="confirmPassword" className="text-white">
                            Подтвердите пароль
                        </Label>
                        <PasswordInput
                            id="confirmPassword"
                            name="confirmPassword"
                            error={error?.isField("confirmPassword")}
                            required
                        />
                        {error?.forField("confirmPassword") && (
                            <p className="text-red-500 text mt-1 !-mb-8">
                                {error.forField("confirmPassword")}
                            </p>
                        )}
                    </div>
                    <Button
                        type="submit"
                        className="w-full !mt-12 !p-6"
                        disabled={state === "loading" || state === "submitting"}
                    >
                        {state === "loading" || state === "submitting" ? (
                            <l-ring-2 color="#424242" size={25} stroke={4} />
                        ) : (
                            <span>Зарегистрироваться</span>
                        )}
                    </Button>
                </Form>
                <p className="text-center text-white text-sm">
                    Уже зарегистрированы?{" "}
                    <Link to="/sign-in" className="text-blue-400 hover:underline text-nowrap">
                        Войдите в аккаунт
                    </Link>
                </p>
            </div>
        </div>
    );
}
