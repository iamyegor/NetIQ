import { cn } from "@/lib/utils";

export default function LoadingSpinner({
    variant,
    className,
    size,
}: {
    variant?: "gray" | "purple";
    size?: "sm" | "base";
    className?: string;
}) {
    return (
        <div
            className={cn(
                "animate-spin rounded-full border-gray-300",
                variant === "gray" ? "border-t-gray-500" : "border-t-neutral-600",
                size === "sm" ? "h-4 w-4 border-2" : "h-6 w-6 border-4",
                className
            )}
        />
    );
}
