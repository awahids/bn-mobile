import { type ReactNode } from "react";
import { cn } from "@/lib/utils";

interface MobilePageShellProps {
  children: ReactNode;
  className?: string;
}

export function MobilePageShell({ children, className }: MobilePageShellProps) {
  return (
    <div className={cn("min-h-screen max-w-md mx-auto bg-background relative", className)}>
      {children}
    </div>
  );
}
