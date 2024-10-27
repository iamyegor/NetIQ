import { Button } from "@/components/ui/button.tsx";
import authApi from "@/lib/backend/authApi";
import FeedbackMessage from "@/types/FeedbackMessage.ts";
import RouteError from "@/types/errors/RouteError.ts";
import classNames from "classnames";
import { Mail } from "lucide-react";
import { useEffect, useState } from "react";
import useResendCodeTranslation from "./hooks/useResendCodeTranslation";

interface ResendCodeButtonProps {
    setSecondsLeft: (seconds: number) => void;
    secondsLeft: number;
    maxSeconds: number;
    setMessage: (value: FeedbackMessage) => void;
    text: string;
}

export default function ResendCodeButton({
    setSecondsLeft,
    secondsLeft,
    maxSeconds,
    setMessage,
    text,
}: ResendCodeButtonProps) {
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [unexpectedError, setUnexpectedError] = useState<boolean>(false);
    const t = useResendCodeTranslation();

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
            setMessage(FeedbackMessage.createSuccess(t.codeSent));
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
                    <span>{text}</span>
                </>
            )}
        </Button>
    );
}
