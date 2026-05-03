import type { MouseEventHandler, ReactNode } from "react";

export default function Btn({
    onClick,
    disabled = false,
    title,
    children,
    variant = "ghost",
}: {
    onClick: MouseEventHandler<HTMLButtonElement>;
    disabled?: boolean;
    title?: string;
    children: ReactNode;
    variant?: "ghost" | "label" | "primary";
}) {
    return (
        <button
            onClick={onClick}
            disabled={disabled}
            title={title}
            className={[
                "inline-flex items-center justify-center rounded text-xs font-medium transition-all duration-150 shrink-0",
                "focus:outline-none focus-visible:ring-1 focus-visible:ring-amber-400/50",
                disabled && "opacity-20 cursor-not-allowed pointer-events-none",
                variant === "ghost" && "h-7 w-7 p-0 text-neutral-500 hover:text-neutral-200 hover:bg-neutral-800",
                variant === "label" && "h-7 px-2.5 text-neutral-500 hover:text-neutral-200 hover:bg-neutral-800",
                variant === "primary" && "h-7 px-3 bg-amber-400 text-neutral-950 hover:bg-amber-300 font-semibold",
            ]
                .filter(Boolean)
                .join(" ")}
        >
            {children}
        </button>
    );
}
