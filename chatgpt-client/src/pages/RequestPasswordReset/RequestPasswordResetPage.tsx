import { Form, Link, useActionData, useNavigation } from "react-router-dom";
import FeedbackMessageComponent from "@/pages/ConfirmEmailPage/components/VerificationCodeInput/FeedbackMessageComponent.tsx";
import FeedbackMessage from "@/types/FeedbackMessage.ts";
import { Button } from "@/components/ui/button.tsx";
import { Label } from "@/components/ui/label.tsx";
import { Input } from "@/components/ui/input.tsx";
import { ArrowLeft } from "lucide-react";
import React from "react";

export default function RequestPasswordResetPage() {
    const feedBack = useActionData() as FeedbackMessage | null;
    const { state } = useNavigation();

    return (
        <div className="min-h-full flex justify-center items-center bg-neutral-950 py-5 px-2.5 xs:px-5 sm:px-10">
            <Form
                method="post"
                className="flex flex-col justify-center bg-neutral-800 p-4 sm:p-8 max-w-[540px] gap-y-8 text-white rounded-xl relative border border-neutral-600"
            >
                <Link
                    to="/sign-in"
                    className="absolute top-3 xs:top-4 sm:top-8 md:top-[34px] left-2 xs:left-5 p-2 hover:bg-neutral-200/10 transition rounded-lg"
                >
                    <ArrowLeft className="w-5 h-5" />
                </Link>
                <div className="text-center space-y-4">
                    <h1 className="text-lg xs:text-2xl md:text-4xl font-semibold">
                        Восстановите пароль
                    </h1>
                    <p className="text-sm xs:text-base">
                        Укажите почту на которую мы отправим инструкцию по восстановлению пароля
                    </p>
                </div>
                <div className="space-y-4">
                    <Label htmlFor="password">Пароль</Label>
                    <Input
                        id="email"
                        name="email"
                        type="email"
                        className={`w-full rounded-xl !p-6 !pl-4 !border-neutral-500`}
                        placeholder="Например: myemail@example.com"
                        required
                    />
                    <FeedbackMessageComponent feedback={feedBack} />
                </div>
                <Button className="w-full !p-6" disabled={state === "submitting"}>
                    {state === "submitting" ? (
                        <l-ring-2 color="#424242" size={25} stroke={4} />
                    ) : (
                        <span>Отправить</span>
                    )}
                </Button>
            </Form>
        </div>
    );
}
