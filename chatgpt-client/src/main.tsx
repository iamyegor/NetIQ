import ReactDOM from "react-dom/client";
import "./index.css";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { routes } from "@/lib/routes.tsx";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import "react-loading-skeleton/dist/skeleton.css";
import { ring2 } from "ldrs";
ring2.register();

const queryClient = new QueryClient();

ReactDOM.createRoot(document.getElementById("root")!).render(
    <QueryClientProvider client={queryClient}>
        <RouterProvider router={createBrowserRouter(routes)}></RouterProvider>
    </QueryClientProvider>,
);
