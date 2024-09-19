import { Form } from "react-router-dom";
import { Label } from "@radix-ui/react-label";
import { Input } from "@/components/ui/input.tsx";
import PasswordInput from "@/components/ui/PasswordInput.tsx";
import { Button } from "@/components/ui/button.tsx";
import { FormEvent, useState } from "react";

export default function AdminPage() {
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState("");

    const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        setIsLoading(true);
        setError("");

        await new Promise((resolve) => setTimeout(resolve, 400));

        setIsLoading(false);
        setError("Неверные данные для входа");
    };

    return (
        <div className="min-h-full bg-neutral-950 flex items-center justify-center py-5 px-2.5 xs:px-5 sm:px-10">
            <div className="bg-neutral-800 p-8 pt-5 rounded-xl shadow-lg w-full max-w-md space-y-8 border border-neutral-600">
                <div className="flex flex-col items-center space-y-6">
                    <h2 className="text-2xl font-bold text-white text-center">Админ-панель</h2>
                </div>
                <Form method="post" className="space-y-4 text-white" onSubmit={handleSubmit}>
                    <div className="space-y-4">
                        <Label htmlFor="username" className="text-white">
                            Имя пользователя
                        </Label>
                        <Input
                            id="username"
                            name="username"
                            type="text"
                            className={`w-full rounded-xl !p-6 !pl-4 !border-neutral-500`}
                            required
                        />
                    </div>
                    <div className="space-y-4">
                        <Label htmlFor="password" className="text-white">
                            Пароль
                        </Label>
                        <PasswordInput id="password" name="password" required />
                    </div>
                    {error && <div className="text-red-500 text-sm mt-2">{error}</div>}
                    <Button
                        type="submit"
                        className={`w-full !p-6 ${!error && "!mt-8"}`}
                        disabled={isLoading}
                    >
                        {isLoading ? (
                            <l-ring-2 color="#424242" size={25} stroke={4} />
                        ) : (
                            <span>Войти</span>
                        )}
                    </Button>
                </Form>
            </div>
        </div>
    );
}
