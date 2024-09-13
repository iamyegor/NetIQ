import { Outlet } from "react-router-dom";
import { useEffect } from "react";

export default function RootLayout() {
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
