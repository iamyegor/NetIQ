import RootLayout from "@/components/ui/RootLayout.tsx";
import ChatPage from "@/pages/ChatPage/ChatPage";
import HomePage from "@/pages/HomePage/HomePage.tsx";

export const routes = [
    {
        path: "/",
        element: <RootLayout />,
        children: [
            {
                index: true,
                element: <HomePage />,
            },
            {
                path: "chat",
                element: <ChatPage />,
            },
            {
                path: "chats/:chatId",
                element: <ChatPage />,
            },
        ],
    },
];
