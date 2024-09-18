import { AxiosError } from "axios";
import ServerErrorResponse from "@/types/errors/ServerErrorResponse.ts";
import RouteError from "@/types/errors/RouteError.ts";

interface EmailVerificationErrorDictionary {
    [key: string]: string;
}

const errorsDict: EmailVerificationErrorDictionary = {
    "email.verification.code.has.invalid.length":
        "Код подтверждения электронной почты должен содержать 5 символов.",
    "email.verification.code.is.invalid": "Код подтверждения электронной почты недействителен.",
    "email.verification.code.is.expired": "Код подтверждения электронной почты истек.",
};

export default function extractVerifyEmailError(error: AxiosError<ServerErrorResponse>): string {
    const errorCode = error.response!.data.errorCode;
    if (errorsDict[errorCode] === undefined) {
        throw RouteError.unexpected();
    }
    return errorsDict[errorCode];
}
