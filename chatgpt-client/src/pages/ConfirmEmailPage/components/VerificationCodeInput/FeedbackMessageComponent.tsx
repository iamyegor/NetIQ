import FeedbackMessage from "@/types/FeedbackMessage.ts";
import { Check } from "lucide-react";

interface SuccessOrErrorMessageProps {
    feedback: FeedbackMessage | null;
}

export default function FeedbackMessageComponent({ feedback }: SuccessOrErrorMessageProps) {
    if (!feedback) {
        return;
    }

    return (
        <>
            {feedback!.isSuccess ? (
                <div className="flex space-x-1.5 justify-center">
                    <Check className="w-5 h-5 mt-0.5 flex-shrink-0 text-green-500" />
                    <p className="text-green-500">{feedback!.message}</p>
                </div>
            ) : (
                <p className="text-red-500 text mt-1">{feedback!.message}</p>
            )}
        </>
    );
}
