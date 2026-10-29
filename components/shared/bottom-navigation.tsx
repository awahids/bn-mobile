"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { Home, BookOpen, TrendingUp, User } from "lucide-react";

import { motion } from "framer-motion";

type NavItem = {
  path: string;
  label: string;
  icon: typeof Home;
  isActive: (pathname: string) => boolean;
};

const LEARNING_ROUTE_PREFIXES = [
  "/modules",
  "/hijaiyah",
  "/quran",
  "/tajwid",
  "/dhikr",
  "/quiz",
  "/habits",
  "/sekolah-islam",
];

const navItems = [
  {
    path: "/",
    label: "Beranda",
    icon: Home,
    isActive: (pathname: string) => pathname === "/",
  },
  {
    path: "/modules",
    label: "Belajar",
    icon: BookOpen,
    isActive: (pathname: string) =>
      LEARNING_ROUTE_PREFIXES.some((prefix) => pathname.startsWith(prefix)),
  },
  {
    path: "/progress",
    label: "Progress",
    icon: TrendingUp,
    isActive: (pathname: string) => pathname.startsWith("/progress"),
  },
  {
    path: "/profile",
    label: "Profil",
    icon: User,
    isActive: (pathname: string) => pathname.startsWith("/profile"),
  },
] satisfies NavItem[];

const LABEL_WIDTH = 68;

// Pill tab bar modelled on 21st.dev "Bottom Nav Bar" (arunachalam): solid card
// surface, inactive tabs show only the icon, the active tab grows to reveal
// its label.
export function BottomNavigation() {
  const pathname = usePathname();

  return (
    <div
      className="fixed left-1/2 z-50 -translate-x-1/2"
      style={{ bottom: "max(0.75rem, env(safe-area-inset-bottom))", width: "min(92vw, 26rem)" }}
    >
      <nav
        aria-label="Navigasi utama"
        className="flex items-center justify-between gap-1 rounded-full border border-border bg-card/95 p-1.5 shadow-lg shadow-black/5 backdrop-blur"
      >
        {navItems.map(({ path, label, icon: Icon, isActive }) => {
          const active = pathname ? isActive(pathname) : false;

          return (
            <Link
              key={path}
              href={path}
              className={cn(
                "flex h-12 min-w-12 items-center justify-center rounded-full px-3 outline-none transition-colors duration-200 touch-manipulation focus-visible:ring-2 focus-visible:ring-ring",
                // The active tab sizes to its label; the others share the rest.
                active
                  ? "flex-none bg-primary/10 text-primary"
                  : "flex-1 text-muted-foreground hover:bg-muted hover:text-foreground"
              )}
              data-testid={`nav-${label.toLowerCase()}`}
              aria-current={active ? "page" : undefined}
              aria-label={label}
            >
              <Icon className="h-5 w-5 shrink-0" strokeWidth={active ? 2.4 : 2} aria-hidden />
              <motion.div
                initial={false}
                animate={{
                  width: active ? LABEL_WIDTH : 0,
                  opacity: active ? 1 : 0,
                  marginLeft: active ? 8 : 0,
                }}
                transition={{
                  width: { type: "spring", stiffness: 350, damping: 32 },
                  opacity: { duration: 0.18 },
                  marginLeft: { duration: 0.18 },
                }}
                style={{ overflow: "hidden", display: "flex" }}
              >
                <span className="whitespace-nowrap text-sm font-semibold">{label}</span>
              </motion.div>
            </Link>
          );
        })}
      </nav>
    </div>
  );
}
