import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Form, Link, useActionData, useNavigation } from "react-router-dom";
import FieldError from "@/types/errors/FieldError";
import netIqLogo from "@/assets/common/netiq.png";
import PasswordInput from "@/components/ui/PasswordInput.tsx";
import useSignUpTranslation from "./hooks/useSignUpTranslation";

export default function SignUpPage() {
    const actionData = useActionData() as { error: FieldError } | null;
    const { state } = useNavigation();
    const error = actionData?.error ?? null;
    const t = useSignUpTranslation();

    return (
        <div className="min-h-full bg-neutral-950 flex items-center justify-center py-5 px-5 sm:px-10">
            <div className="bg-neutral-800 p-4 xs:p-8 py-8 rounded-xl shadow-lg w-full max-w-md border border-neutral-600">
                <div className="flex flex-col items-center space-y-6">
                    <img src={netIqLogo} alt="Logo" className="h-20 object-cover" />
                    <h2 className="text-4xl font-bold text-white text-center">{t.signUp}</h2>
                </div>
                <Form method="post" className="text-white">
                    <div className="mb-6">
                        <Label htmlFor="email" className="text-white">
                            {t.email}
                        </Label>
                        <Input
                            id="email"
                            name="email"
                            type="email"
                            className={`w-full mt-2 rounded-xl !p-6 !pl-4 !border-neutral-500 ${error?.isField("email") ? "border !border-red-500" : ""}`}
                            required
                        />
                        {error?.forField("email") && (
                            <p className="text-red-500 text-sm mt-2 font-medium -mb-3">{error.forField("email")}</p>
                        )}
                    </div>
                    <div className="mb-6">
                        <Label htmlFor="password" className="text-white">
                            {t.password}
                        </Label>
                        <PasswordInput
                            id="password"
                            name="password"
                            error={error?.isField("password")}
                            className="mt-2"
                            required
                        />
                        {error?.forField("password") && (
                            <p className="text-red-500 text-sm mt-2 font-medium -mb-3">
                                {error.forField("password")}
                            </p>
                        )}
                    </div>
                    <div className="mb-10">
                        <Label htmlFor="confirmPassword" className="text-white">
                            {t.confirmPassword}
                        </Label>
                        <PasswordInput
                            id="confirmPassword"
                            name="confirmPassword"
                            error={error?.isField("confirmPassword")}
                            className="mt-2"
                            required
                        />
                        {error?.forField("confirmPassword") && (
                            <p className="text-red-500 text mt-2 text-sm font-medium -mb-3">
                                {error.forField("confirmPassword")}
                            </p>
                        )}
                    </div>
                    <Button
                        type="submit"
                        className="w-full !p-6"
                        disabled={state === "submitting"}
                    >
                        {state === "submitting" ? (
                            <l-ring-2 color="#424242" size={25} stroke={4} />
                        ) : (
                            <span>{t.register}</span>
                        )}
                    </Button>
                </Form>
                <p className="text-center text-white text-sm mt-5 leading-[1.6]">
                    {t.alreadyRegistered}{" "}
                    <Link to="/sign-in" className="text-blue-400 hover:underline text-nowrap">
                        {t.signIn}
                    </Link>
                </p>
            </div>
        </div>
    );
}
