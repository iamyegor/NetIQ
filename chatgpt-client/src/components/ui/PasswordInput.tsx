import React, { useState } from "react";
import { Input } from "@/components/ui/input";
import ClosedEyeSvg from "@/assets/auth/closed-eye.svg?react";
import OpenEyeSvg from "@/assets/auth/open-eye.svg?react";

interface PasswordInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
    error?: boolean;
}

const PasswordInput: React.FC<PasswordInputProps> = ({ className, error, ...props }) => {
    const [showPassword, setShowPassword] = useState(false);

    const togglePasswordVisibility = () => setShowPassword(!showPassword);

    return (
        <div className="relative">
            <Input
                type={showPassword ? "text" : "password"}
                className={`w-full rounded-xl !p-6 !pl-4 pr-12 !border-neutral-500 ${error ? "!border !border-red-500" : ""} ${className}`}
                {...props}
            />
            <button
                type="button"
                className="absolute right-4 top-1/2 transform -translate-y-1/2 fill-white"
                onClick={togglePasswordVisibility}
            >
                {showPassword ? (
                    <ClosedEyeSvg className="w-6 h-6 text-gray-400" />
                ) : (
                    <OpenEyeSvg className="w-6 h-6 text-gray-400" />
                )}
            </button>
        </div>
    );
};

export default PasswordInput;
