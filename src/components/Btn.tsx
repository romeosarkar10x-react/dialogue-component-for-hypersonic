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
                "focus:outline-none focus-visible:ring-1 focus-visible:ring-primary/50",
                disabled && "opacity-20 cursor-not-allowed pointer-events-none",
                variant === "ghost" && "h-7 w-7 p-0 text-muted-foreground hover:text-foreground hover:bg-muted",
                variant === "label" && "h-7 px-2.5 text-muted-foreground hover:text-foreground hover:bg-muted",
                variant === "primary" &&
                    "h-7 px-3 bg-primary text-primary-foreground hover:bg-primary/90 font-semibold",
            ]
                .filter(Boolean)
                .join(" ")}
        >
            {children}
        </button>
    );
}
