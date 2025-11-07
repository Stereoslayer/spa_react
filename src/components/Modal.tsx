import React, { useEffect, useRef } from "react";
import { createPortal } from "react-dom";
import { cn } from "@/utils/cn";

type ModalProps = React.PropsWithChildren<{
    open: boolean;
    onClose: () => void;
    className?: string;
    overlayClassName?: string;
    closeOnEsc?: boolean;
    unstyled?: boolean;
    centered?: boolean;
    style?: React.CSSProperties;
}>;

export default function Modal({
                                  open,
                                  onClose,
                                  className,
                                  overlayClassName,
                                  closeOnEsc = true,
                                  unstyled = false,
                                  centered = false,
                                  style,
                                  children,
                              }: ModalProps) {
    const contentRef = useRef<HTMLDivElement | null>(null);

    useEffect(() => {
        if (!open || !closeOnEsc) return;
        const onKey = (e: KeyboardEvent) => {
            if (e.key === "Escape") onClose();
        };
        document.addEventListener("keydown", onKey);
        const prev = document.body.style.overflow;
        document.body.style.overflow = "hidden";
        return () => {
            document.removeEventListener("keydown", onKey);
            document.body.style.overflow = prev;
        };
    }, [open, closeOnEsc, onClose]);

    if (!open) return null;

    return createPortal(
        <div
            className="fixed inset-0 z-50"
            aria-modal="true"
            role="dialog"
            onMouseDown={(e) => {
                if (contentRef.current && !contentRef.current.contains(e.target as Node)) {
                    onClose();
                }
            }}
        >
            <div
                className={cn(
                    "absolute inset-0 bg-black/50",
                    overlayClassName
                )}
            />
            <div
                className={cn(
                    "absolute inset-0 flex justify-center overflow-auto",
                    centered ? "items-center" : "items-start"
                )}
            >
                <div
                    ref={contentRef}
                    className={cn(
                        unstyled
                            ? ""
                            : "mt-16 w-full max-w-3xl rounded-2xl bg-white shadow-xl border border-gray-200 mx-4",
                        className
                    )}
                    onMouseDown={(e) => e.stopPropagation()}
                    /** 👇 пробрасываем style */
                    style={style}
                >
                    {children}
                </div>
            </div>
        </div>,
        document.body
    );
}