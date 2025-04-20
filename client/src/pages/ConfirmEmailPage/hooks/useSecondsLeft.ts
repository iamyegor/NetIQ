import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";

export default function useSecondsLeft(initialTime: number) {
    const [secondsLeft, setSecondsLeft] = useState<number>(() => {
        return parseInt(sessionStorage.getItem("seconds") ?? `${initialTime}`);
    });

    const location = useLocation();

    useEffect(() => {
        sessionStorage.setItem("seconds", secondsLeft.toString());
        const intervalId = setInterval(() => {
            setSecondsLeft((prevSeconds) => (prevSeconds > 0 ? prevSeconds - 1 : 0));
        }, 1000);

        return () => clearInterval(intervalId);
    }, [secondsLeft]);

    useEffect(() => {
        return () => {
            sessionStorage.removeItem("seconds");
        };
    }, [location]);

    return { secondsLeft, setSecondsLeft };
}
