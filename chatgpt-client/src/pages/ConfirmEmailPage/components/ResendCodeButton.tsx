import classNames from "classnames";
import { useEffect, useState } from "react";
import authApi from "@/lib/authApi.ts";
import FeedbackMessage from "@/types/FeedbackMessage.ts";
import RouteError from "@/types/errors/RouteError.ts";
import { Mail } from "lucide-react";
import { Button } from "@/components/ui/button.tsx";

interface ResendCodeButtonProps {
    setSecondsLeft: (seconds: number) => void;
    secondsLeft: number;
    maxSeconds: number;
    setMessage: (value: FeedbackMessage) => void;
}

export default function ResendCodeButton({
    setSecondsLeft,
    secondsLeft,
    maxSeconds,
    setMessage,
}: ResendCodeButtonProps) {
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [unexpectedError, setUnexpectedError] = useState<boolean>(false);

    useEffect(() => {
        if (unexpectedError) {
            throw RouteError.unexpected();
        }
    }, [unexpectedError]);

    async function resendCode() {
        if (isDisabled()) {
            return;
        }

        setIsLoading(true);

        try {
            await authApi.post("resend-email-code");
            setMessage(FeedbackMessage.createSuccess("Код подтверждения отправлен успешно!"));
            setSecondsLeft(maxSeconds);
        } catch (err) {
            setUnexpectedError(true);
        }

        setIsLoading(false);
    }

    function isDisabled() {
        return secondsLeft > 0 || isLoading;
    }

    return (
        <Button
            variant="outline"
            type="button"
            className={classNames(
                "flex justify-center items-center space-x-2 rounded-lg transition text-white sm:!flex-1 h-[50px]",
                isLoading
                    ? "bg-neutral-500 rounded-lg transition"
                    : "bg- disabled:bg-neutral-500/70 disabled:shadow-none shadow hover:shadow-lg disabled:text-neutral-300",
            )}
            disabled={isDisabled()}
            onClick={resendCode}
        >
            {isLoading ? (
                <l-ring-2 color="#525252" size={30} />
            ) : (
                <>
                    <Mail
                        className={`w-5 h-5 ${isDisabled() ? "text-neutral-500" : "text-white"}`}
                    />
                    <span>Отправить повторно</span>
                </>
            )}
        </Button>
    );
}
