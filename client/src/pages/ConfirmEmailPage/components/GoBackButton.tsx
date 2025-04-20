import { NavLink } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import React from "react";

interface GoBackButtonProps {
    route: string;
    text: string;
}

export default function GoBackButton({ text, route }: GoBackButtonProps) {
    return (
        <NavLink
            to={route}
            className="flex sm:!flex-1 justify-center items-center bg-neutral-900 p-3 rounded-lg hover:cursor-pointer hover:shadow-md h-[50px] text-white border border-neutral-600 hover:bg-neutral-950 transition space-x-3"
        >
            <ArrowLeft className="h-5 w-5" />
            <span>{text}</span>
        </NavLink>
    );
}
