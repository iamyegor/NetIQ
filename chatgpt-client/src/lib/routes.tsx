import RootLayout from "@/components/RootLayout/RootLayout";
import ChatPage from "@/pages/ChatPage/ChatPage";
import ConfirmEmailPage from "@/pages/ConfirmEmailPage/ConfirmEmailPage.tsx";
import confirmEmailPageAction from "@/pages/ConfirmEmailPage/actions/confirmEmailPageAction.ts";
import ErrorPage from "@/pages/ErrorPage/ErrorPage.tsx";
import HomePage from "@/pages/HomePage/HomePage.tsx";
import PricingPage from "@/pages/PricingPage/PricingPage.tsx";
import RequestPasswordResetPage from "@/pages/RequestPasswordReset/RequestPasswordResetPage";
import requestPasswordResetPageAction from "@/pages/RequestPasswordReset/actions/requestPasswordResetPageAction";
import ResetPasswordPage from "@/pages/ResetPassword/ResetPasswordPage.tsx";
import resetPasswordPageAction from "@/pages/ResetPassword/actions/resetPasswordPageAction.ts";
import SignInPage from "@/pages/SignInPage/SignInPage";
import signInPageAction from "@/pages/SignInPage/actions/signInPageAction";
import SignUpPage from "@/pages/SignUpPage/SignUpPage";
import { signUpPageAction } from "@/pages/SignUpPage/actions/signUpPageAction";
import authenticateAndRedirectToChatOrSignInLoader from "@/utils/loaders/authenticateAndRedirectToChatOrSignInLoader";
import authenticateAndRedirectToChatOrStayLoader from "@/utils/loaders/authenticateAndRedirectToChatOrStayLoader";
import redirectToSignInOnUnauthenticatedLoader from "@/utils/loaders/redirectToSignInOnUnauthenticatedLoader";

export const routes = [
    {
        path: "/",
        element: <RootLayout />,
        errorElement: <ErrorPage />,
        children: [
            {
                index: true,
                element: <HomePage />,
                loader: authenticateAndRedirectToChatOrSignInLoader,
            },
            {
                path: "chat",
                element: <ChatPage />,
                // loader: redirectToSignInOnUnauthenticatedLoader,
            },
            {
                path: "chats/:chatId",
                element: <ChatPage />,
                loader: redirectToSignInOnUnauthenticatedLoader,
            },
            {
                path: "sign-up",
                element: <SignUpPage />,
                action: signUpPageAction,
                loader: authenticateAndRedirectToChatOrStayLoader,
            },
            {
                path: "confirm-email",
                element: <ConfirmEmailPage />,
                action: confirmEmailPageAction,
                loader: authenticateAndRedirectToChatOrStayLoader,
            },
            {
                path: "sign-in",
                element: <SignInPage />,
                action: signInPageAction,
                loader: authenticateAndRedirectToChatOrStayLoader,
            },
            {
                path: "request-password-reset",
                element: <RequestPasswordResetPage />,
                action: requestPasswordResetPageAction,
                loader: authenticateAndRedirectToChatOrStayLoader,
            },
            {
                path: "reset-password",
                element: <ResetPasswordPage />,
                action: resetPasswordPageAction,
                loader: authenticateAndRedirectToChatOrStayLoader,
            },
            {
                path: "pricing",
                element: <PricingPage />,
            },
            {
                path: "*",
                element: <ErrorPage />,
            },
        ],
    },
];
