import { cn } from "@/utils/cn";
import React from "react";

type Props = React.PropsWithChildren<{ className?: string }>;

export default function Container({ className, children }: Props) {
    return <div className={cn("max-w-6xl mx-auto px-4", className)}>{children}</div>;
}