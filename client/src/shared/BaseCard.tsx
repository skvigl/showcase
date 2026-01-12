import React, { PropsWithChildren } from "react";
import { cn } from "@/shared/utils";

interface BaseCardProps extends PropsWithChildren {
  className?: string;
}

export const BaseCard: React.FC<BaseCardProps> = ({ className, children }) => {
  return (
    <div
      className={cn(
        "p-4",
        "bg-white border rounded-lg border-cyan-800",
        "text-gray-800 text-md lg:text-lg font-medium",
        "transition hover:ring-2 hover:ring-cyan-800 hover:-translate-y-1",
        className
      )}
    >
      {children}
    </div>
  );
};
