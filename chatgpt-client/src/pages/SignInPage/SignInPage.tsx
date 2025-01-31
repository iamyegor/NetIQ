import netIqLogo from "@/assets/common/netiq.png";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import PasswordInput from "@/components/ui/PasswordInput";
import "ldrs/ring2";
import { Form, Link, useActionData, useNavigation } from "react-router-dom";
import useSignInTranslation from "./hooks/useSignInTranslation";

export default function SignInPage() {
    const actionData = useActionData() as { error: string } | undefined;
    const { state } = useNavigation();
    const error = actionData?.error ?? null;
    const t = useSignInTranslation();

    return (
        <div className="min-h-[100dvh] bg-neutral-950 flex items-center justify-center py-5 px-5 sm:px-10">
            <div className="bg-neutral-800 p-4 xs:p-8 py-8 rounded-xl shadow-lg w-full max-w-md border border-neutral-600">
                <div className="flex flex-col items-center space-y-6">
                    <img src={netIqLogo} alt="Logo" className="h-20 object-cover" />
                    <h2 className="text-4xl font-bold text-white text-center">{t.signIn}</h2>
                </div>

                {error && (
                    <p className="bg-red-900 p-2 py-3 rounded-lg text-red-200 text-sm text-center mb-4 mt-4">
                        {error}
                    </p>
                )}

                <Form method="post" className="text-white">
                    <div className="space-y-2 mb-4">
                        <Label htmlFor="email" className="text-white">
                            {t.email}
                        </Label>
                        <Input
                            id="email"
                            name="email"
                            type="email"
                            className="w-full rounded-xl !p-6 !pl-4 !border-neutral-500"
                            required
                        />
                    </div>

                    <div className="space-y-2 mb-6">
                        <Label htmlFor="password" className="text-white">
                            {t.password}
                        </Label>
                        <PasswordInput id="password" name="password" required />
                    </div>

                    <p className="space-x-2 text-sm flex justify-between mb-4">
                        <span>{t.forgotPassword}</span>
                        <Link
                            className="text-blue-400 hover:underline"
                            to="/request-password-reset"
                        >
                            {t.recoverAccess}
                        </Link>
                    </p>

                    <Button type="submit" className="w-full !p-6" disabled={state === "submitting"}>
                        {state === "submitting" ? (
                            <l-ring-2 color="#424242" size={25} stroke={4} />
                        ) : (
                            <span>{t.enter}</span>
                        )}
                    </Button>
                </Form>

                <p className="text-center text-white mt-6 text-sm text-nowrap">
                    {t.noAccount}{" "}
                    <Link to="/sign-up" className="text-blue-400 hover:underline">
                        {t.register}
                    </Link>
                </p>
            </div>
        </div>
    );
}
