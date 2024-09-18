import { useState } from "react";
import VerificationCodeInput from "@/pages/ConfirmEmailPage/components/VerificationCodeInput/VerificationCodeInput.tsx";
import useEmail from "@/pages/ConfirmEmailPage/hooks/useEmail.ts";
import { Form, useNavigation } from "react-router-dom";
import ResendCodeButton from "@/pages/ConfirmEmailPage/components/ResendCodeButton.tsx";
import GoBackButton from "@/pages/ConfirmEmailPage/components/GoBackButton.tsx";
import useSecondsLeft from "@/pages/ConfirmEmailPage/hooks/useSecondsLeft.ts";
import CountdownDisplay from "@/pages/ConfirmEmailPage/components/VerificationCodeInput/CountdownDisplay.tsx";
import useEmailConfirmationMessage from "@/pages/ConfirmEmailPage/hooks/useEmailConfirmationMessage.ts";
import { Button } from "@/components/ui/button.tsx";

export default function ConfirmEmailPage() {
    const [inputs, setInputs] = useState<string[]>(Array(5).fill(""));
    const { secondsLeft, setSecondsLeft } = useSecondsLeft(60);
    const { message, setMessage } = useEmailConfirmationMessage();
    const { state } = useNavigation();
    const email = useEmail();

    return (
        <div className="h-full flex justify-center items-center bg-black py-5 px-2.5 xs:px-5 sm:px-10">
            <Form
                method="post"
                className="flex flex-col justify-center items-center p-8 w-full max-w-[600px] bg-neutral-800 rounded-2xl space-y-8 border border-neutral-600"
            >
                <div className="space-y-4 text-center text-white">
                    <h1 className="text-2xl xs:text-3xl sm:text-4xl font-semibold">Подтвердите почту</h1>
                    <p className="space-x-2 text-sm xs:text-base">
                        <span>Введите код который мы прислали на</span>
                        <span className="underline">{email}</span>
                    </p>
                </div>
                <VerificationCodeInput inputs={inputs} setInputs={setInputs} message={message} />
                <Button
                    className="rounded-lg py-6 text-white w-full"
                    disabled={
                        inputs.some((x) => x === "") ||
                        state === "loading" ||
                        state === "submitting"
                    }
                >
                    {state === "loading" || state === "submitting" ? (
                        <l-ring-2 color="#424242" size={25} stroke={4} />
                    ) : (
                        <span>Подтвердить</span>
                    )}
                </Button>
                <div className="flex flex-col sm:flex-row w-full sm:space-x-5 space-y-4 sm:space-y-0">
                    <GoBackButton route="/sign-up" text="Назад" />
                    <ResendCodeButton
                        setSecondsLeft={setSecondsLeft}
                        secondsLeft={secondsLeft}
                        maxSeconds={60}
                        setMessage={setMessage}
                    />
                </div>
                <CountdownDisplay secondsLeft={secondsLeft} />
            </Form>
        </div>
    );
}
