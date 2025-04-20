import React, { useEffect, useRef } from "react";
import classNames from "classnames";
import focusRight from "@/pages/ConfirmEmailPage/utils/focusRight.ts";
import focusInputBasedOnKey from "@/pages/ConfirmEmailPage/utils/focusInputBasedOnKey.ts";
import addNewValueToInputs from "@/pages/ConfirmEmailPage/utils/addNewValueToInputs.ts";
import FeedbackMessageComponent from "@/pages/ConfirmEmailPage/components/VerificationCodeInput/FeedbackMessageComponent.tsx";
import FeedbackMessage from "@/types/FeedbackMessage.ts";

export const IS_NUMBER_REGEX = /^\d?$/;
export const ONLY_NUMBERS_REGEX = /^\d+$/;

interface VerificationCodeProps {
    inputs: string[];
    setInputs: (inputs: string[]) => void;
    message: FeedbackMessage | null;
}

export default function VerificationCodeInput({
    inputs,
    setInputs,
    message,
}: VerificationCodeProps) {
    const inputRefs = useRef<HTMLInputElement[]>([]);

    useEffect(() => {
        inputRefs.current = inputRefs.current.slice(0, inputs.length);
    }, []);

    function handleChange(index: number, value: string) {
        if (IS_NUMBER_REGEX.test(value)) {
            setInputs(addNewValueToInputs(value, inputs, index));
            if (value && index < inputs.length - 1) {
                focusRight(inputRefs.current, index);
            }
        }
    }

    function handleKeydown(event: React.KeyboardEvent<HTMLInputElement>, index: number) {
        focusInputBasedOnKey(event.key, index, inputs, inputRefs.current);
    }

    function handlePaste(event: React.ClipboardEvent<HTMLInputElement>) {
        event.preventDefault();
        const pastedText: string = event.clipboardData.getData("text").trim();

        if (pastedText.length === inputs.length && ONLY_NUMBERS_REGEX.test(pastedText)) {
            setInputs(pastedText.split(""));
            inputRefs.current[inputs.length - 1].focus();
        }
    }

    function placeCaretBehindCharacter(input: HTMLInputElement) {
        input.setSelectionRange(input.value.length, input.value.length);
    }

    return (
        <div className="space-y-6 text-center">
            <div className="flex justify-center space-x-2 sm:space-x-3">
                {inputs.map((value, index) => (
                    <input
                        ref={(el) => {
                            inputRefs.current[index] = el!;
                        }}
                        name={`code-${index}`}
                        key={index}
                        id={`input-${index}`}
                        type="text"
                        autoComplete="off"
                        maxLength={1}
                        onPaste={(e) => handlePaste(e)}
                        value={value}
                        onSelect={() => placeCaretBehindCharacter(inputRefs.current[index])}
                        onChange={(e) => handleChange(index, e.target.value)}
                        onKeyDown={(e) => handleKeydown(e, index)}
                        className={classNames(
                            "w-[50px] sm:w-14 h-[50px] sm:h-14 bg-neutral-900 text-white text-center text-xl font-semibold border border-neutral-600 rounded-md outline-none ring-offset-2 ring-offset-neutral-800 focus:ring-1 transition-all",
                            !message || message.isSuccess
                                ? "ring-neutral-600"
                                : "ring-red-600 ring-1",
                        )}
                        inputMode="numeric"
                    />
                ))}
            </div>
            <FeedbackMessageComponent feedback={message} />
        </div>
    );
}
