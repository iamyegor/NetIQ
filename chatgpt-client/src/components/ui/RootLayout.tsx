import { Outlet, useLocation } from "react-router-dom";
import { useEffect } from "react";

export default function RootLayout() {
    const { pathname } = useLocation();

    useEffect(() => {
        window.scrollTo(0, 0);
    }, [pathname]);

    useEffect(() => {
        const htmlElement = document.documentElement;
        htmlElement.classList.toggle("dark");
    }, []);

    return (
        <>
            <Outlet />
        </>
    );
}
