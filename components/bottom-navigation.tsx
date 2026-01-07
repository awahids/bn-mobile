"use client";

import { usePathname, useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import { Home, BookOpen, Users, TrendingUp, User } from "lucide-react";

const navItems = [
  { path: "/", label: "Beranda", icon: Home },
  { path: "/hijaiyah", label: "Pelajaran", icon: BookOpen },
  { path: "/progress", label: "Progress", icon: TrendingUp },
  { path: "/profile", label: "Profil", icon: User },
];

export function BottomNavigation() {
  const pathname = usePathname();
  const router = useRouter();

  const isActive = (path: string) => {
    if (path === "/") {
      return pathname === "/";
    }
    return pathname.startsWith(path);
  };

  return (
    <nav className="fixed bottom-0 left-1/2 transform -translate-x-1/2 w-full max-w-md bg-card border-t border-border safe-area-bottom">
      <div className="flex items-center justify-around py-2 px-4">
        {navItems.map(({ path, label, icon: Icon }) => (
          <button
            key={path}
            onClick={() => router.push(path)}
            className={cn(
              "flex flex-col items-center py-2 px-3 transition-colors touch-target",
              isActive(path)
                ? "text-primary"
                : "text-muted-foreground hover:text-foreground"
            )}
            data-testid={`nav-${label.toLowerCase()}`}
          >
            <Icon className="w-5 h-5 mb-1" />
            <span className="text-xs font-medium">{label}</span>
          </button>
        ))}
      </div>
    </nav>
  );
}
