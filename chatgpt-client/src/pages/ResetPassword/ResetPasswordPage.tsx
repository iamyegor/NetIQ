import { Button } from "@/components/ui/button.tsx";
import PasswordInput from "@/components/ui/PasswordInput.tsx";
import { Form, useActionData, useNavigation } from "react-router-dom";
import useResetPasswordTranslation from "./hooks/useResetPasswordTranslation";
import LoadingSpinner from "@/components/ui/loading-spinner";

export default function ResetPasswordPage() {
    const actionData = useActionData() as { error: string } | null;
    const error = actionData?.error ?? null;
    const { state } = useNavigation();
    const t = useResetPasswordTranslation();

    return (
        <div className="min-h-full flex justify-center items-center bg-neutral-950 py-5 px-2.5 xs:px-5 sm:px-10">
            <Form
                method="post"
                className="flex flex-col justify-center bg-neutral-800 w-full p-5 xs:p-8 max-w-lg gap-y-8 text-white rounded-xl relative border border-neutral-600"
            >
                <div className="text-center space-y-4">
                    <h1 className="text-2xl xs:text-3xl font-semibold">{t.title}</h1>
                    <p className="text-base">{t.subtitle}</p>
                </div>
                <PasswordInput
                    id="password"
                    name="password"
                    required
                    placeholder={t.newPasswordPlaceholder}
                />
                <PasswordInput
                    id="confirmPassword"
                    name="confirmPassword"
                    required
                    placeholder={t.confirmPasswordPlaceholder}
                />
                {error && <p className="text-red-500 text-sm !-mt-3">{error}</p>}
                <Button type="submit" className="w-full !p-6" disabled={state === "submitting"}>
                    {state === "submitting" ? <LoadingSpinner /> : <span>{t.submitButton}</span>}
                </Button>
            </Form>
        </div>
    );
}
