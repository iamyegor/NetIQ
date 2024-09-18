import React, { useEffect, useState } from "react";
import { Link, useRouteError } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { LuAlertTriangle } from "react-icons/lu";
import RouteError from "@/types/errors/RouteError.ts";

const ErrorPage: React.FC = () => {
    const error = useRouteError() as RouteError | null;
    const [message, setMessage] = useState<string>("");
    const [title, setTitle] = useState<string>("");

    useEffect(() => {
        if (!error) {
            setMessage("Упс! Чат или страница, которую вы ищете, не существует.");
            setTitle("404 - Страница не найдена");
        } else {
            setMessage(error.message);
            setTitle(error.title);
        }
    }, [error]);

    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-neutral-800 text-gray-100 space-y-7 px-5">
            <LuAlertTriangle className="w-20 h-20 text-white" />
            <h1 className="text-5xl font-bold text-center">{title}</h1>
            <p className="text-xl text-center">{message}</p>
            <Link
                to="/"
                className="bg-white hover:bg-neutral-200 rounded-xl text-black flex items-center p-3 px-7 space-x-3"
            >
                <ArrowLeft className="h-5 w-5" />
                <span>Назад</span>
            </Link>
        </div>
    );
};

export default ErrorPage;
