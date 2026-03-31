import { useState } from "react";
import { Transition } from "@headlessui/react";
import clsx from "clsx";

type TooltipProps = {
    children: React.ReactNode;
    content: string;
    position?: "top" | "bottom" | "left" | "right";
    className?: string;
};

export function Tooltip({
    children,
    content,
    position = "top",
    className,
}: TooltipProps) {
    const [visible, setVisible] = useState(false);

    const positionClasses = {
        top: "bottom-full left-1/2 -translate-x-1/2 mb-2",
        bottom: "top-full left-1/2 -translate-x-1/2 mt-2",
        left: "right-full top-1/2 -translate-y-1/2 mr-2",
        right: "left-full top-1/2 -translate-y-1/2 ml-2",
    };

    return (
        <div
            className="relative inline-flex"
            onMouseEnter={() => setVisible(true)}
            onMouseLeave={() => setVisible(false)}
            onFocus={() => setVisible(true)}
            onBlur={() => setVisible(false)}
        >
            {children}
            <Transition
                show={visible}
                enter="transition ease-out duration-150"
                enterFrom="opacity-0 scale-95"
                enterTo="opacity-100 scale-100"
                leave="transition ease-in duration-100"
                leaveFrom="opacity-100 scale-100"
                leaveTo="opacity-0 scale-95"
            >
                <div
                    role="tooltip"
                    className={clsx(
                        "absolute z-50 whitespace-nowrap rounded-md bg-black px-2 py-1 text-xs text-white shadow-lg",
                        positionClasses[position],
                        className
                    )}
                >
                    {content}
                    {/* Small arrow */}
                    <div
                        className={clsx(
                            "absolute size-2 rotate-45 bg-black",
                            position === "top" && "left-1/2 -bottom-1 -translate-x-1/2",
                            position === "bottom" && "left-1/2 -top-1 -translate-x-1/2",
                            position === "left" && "top-1/2 -right-1 -translate-y-1/2",
                            position === "right" && "top-1/2 -left-1 -translate-y-1/2"
                        )}
                    />
                </div>
            </Transition>
        </div>
    );
}
