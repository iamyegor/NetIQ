import useDetectLanguage from "@/components/RootLayout/_hooks/useLanguageDetection";
import useScrollPageToBottomOnLoad from "@/components/RootLayout/_hooks/useScrollPageToBottomOnLoad";
import useSetThemeToDarkOnLoad from "@/components/RootLayout/_hooks/useSetThemeToDarkOnLoad";
import { useBaseEventSource } from "@/hooks/streaming/useBaseEventSource";
import { Outlet } from "react-router-dom";

export default function RootLayout() {
    useScrollPageToBottomOnLoad();
    useSetThemeToDarkOnLoad();
    useBaseEventSource();
    useDetectLanguage();

    return (
        <>
            <Outlet />
        </>
    );
}
