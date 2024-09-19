import RootLayout from "@/components/ui/RootLayout.tsx";
import ChatPage from "@/pages/ChatPage/ChatPage";
import HomePage from "@/pages/HomePage/HomePage.tsx";
import authenticateAndRedirectToChatOrSignInLoader from "@/loaders/authenticateAndRedirectToChatOrSignInLoader.ts";
import redirectToSignInOnUnauthenticatedLoader from "@/loaders/redirectToSignInOnUnauthenticatedLoader.ts";
import ErrorPage from "@/pages/ErrorPage/ErrorPage.tsx";
import SignUpPage from "@/pages/SignUpPage/SignUpPage.tsx";
import { signUpPageAction } from "@/pages/SignUpPage/actions/signUpPageAction.ts";
import ConfirmEmailPage from "@/pages/ConfirmEmailPage/ConfirmEmailPage.tsx";
import confirmEmailPageAction from "@/pages/ConfirmEmailPage/actions/confirmEmailPageAction.ts";
import SignInPage from "@/pages/SignInPage/SignInPage.tsx";
import signInPageAction from "@/pages/SignInPage/actions/signInPageAction.ts";
import authenticateAndRedirectToChatOrStayLoader from "@/loaders/authenticateAndRedirectToChatOrStayLoader.ts";
import RequestPasswordResetPage from "@/pages/RequestPasswordReset/RequestPasswordResetPage.tsx";
import requestPasswordResetPageAction from "@/pages/RequestPasswordReset/actions/requestPasswordResetPageAction.ts";
import ResetPasswordPage from "@/pages/ResetPassword/ResetPasswordPage.tsx";
import resetPasswordPageAction from "@/pages/ResetPassword/actions/resetPasswordPageAction.ts";
import { AppProvider } from "@/context/AppContext.tsx";
import PricingPage from "@/pages/PricingPage/PricingPage.tsx";
import AdminPage from "@/pages/AdminPage/AdminPage.tsx";

export const routes = [
    {
        path: "/",
        element: (
            <AppProvider>
                <RootLayout />
            </AppProvider>
        ),
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
                loader: redirectToSignInOnUnauthenticatedLoader,
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
                path: "admin",
                element: <AdminPage />,
            },
            {
                path: "*",
                element: <ErrorPage />,
            },
        ],
    },
];
